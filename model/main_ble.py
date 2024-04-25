import torch
import cv2
import math
from torchvision import transforms
import numpy as np
from yoloutils.datasets import letterbox
from yoloutils.general import non_max_suppression
from yoloutils.plots import output_to_target
from datetime import datetime, timedelta
import requests
import json
from io import BytesIO
from dotenv import dotenv_values
import threading
import queue
import asyncio
import firebase_admin
from firebase_admin import credentials, db
from dotenv import dotenv_values
from flask import Flask, request, jsonify
from flask_cors import CORS
from bleak import BleakClient, BleakError

# Create a Flask application
app = Flask(__name__)

# Enable CORS for all routes in the application
CORS(app)

env_vars = dotenv_values()

firebase_vars = {
    "type": env_vars["TYPE"],
    "project_id": env_vars["PROJECT_ID"],
    "private_key_id": env_vars["PRIVATE_KEY_ID"],
    "private_key": env_vars["PRIVATE_KEY"],
    "client_email": env_vars["CLIENT_EMAIL"],
    "client_id": env_vars["CLIENT_ID"],
    "auth_uri": env_vars["AUTH_URI"],
    "token_uri": env_vars["TOKEN_URI"],
    "auth_provider_x509_cert_url": env_vars["AUTH_PROVIDER_X509_CERT_URL"],
    "client_x509_cert_url": env_vars["CLIENT_X509_CERT_URL"],
    "universe_domain": env_vars["UNIVERSE_DOMAIN"]
}

json_str = json.dumps(firebase_vars, indent=4)

with open("firebase_credentials.json", "w") as f:
    f.write(json_str)

cred = credentials.Certificate('firebase_credentials.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': env_vars['DATABASE_URL']
})
fall_ref = db.reference('/fall')

address = "E0:F7:BF:E9:2B:7C"
SERVICE_UUID = "12345678-1234-5678-9abc-def012345678"
CHAR_UUID = "12345678-1234-5678-9abc-def012345679"

accelerometer_queue = queue.Queue()
stop_ble_reading_event = asyncio.Event()

q = queue.Queue()

async def read_characteristics(address, stop_event):
    async with BleakClient(address) as client:
        while not stop_event.is_set():
            try:
                char_values = await client.read_gatt_char(CHAR_UUID)
                int_value = int(char_values[0])
                if (int_value == 49):
                    print("Fallen")
                    now = datetime.now()
                    timestamp = str(int(now.timestamp()))
                    date = now.strftime('%d-%m-%Y')

                    accelerometer_queue.put(int_value)

                    prediction_data = {
                        'username': 'SURA',
                        'timestamp': timestamp,
                        'date': date,
                        'status': 'fallen',
                    }

                    im0 = cv2.imread("fall.jpg")
                    _, buffer = cv2.imencode('.jpg', im0)
                    q.put((prediction_data, buffer))
            except Exception as e:
                print(f"Error: {e}")
            await asyncio.sleep(0.1)

def read_accel_data(address):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(read_characteristics(address, stop_ble_reading_event))

accelerometer_thread = threading.Thread(target=read_accel_data, args=(address,))
accelerometer_thread.start()

env_vars = dotenv_values()

PRIV_KEY = env_vars["PRIV_KEY"]

url = 'http://localhost:5000/api/fall'  

# scheduled to run on GPU by default
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
weights = torch.load('yolov7-w6-pose.pt')
model = weights['model']
model = model.half().to(device)
_ = model.eval()

video_path = "fall2.mp4"
cap = cv2.VideoCapture(video_path)

if (cap.isOpened() == False):
    print('Error while trying to read video. Please check path again')

frame_width = int(cap.get(3))
print(frame_width)
frame_height = int(cap.get(4))
print(frame_height)
frame_count = 0

fallen = False
sent = False
last_sent_time = None

def post_request():
    global last_sent_time
    now = datetime.now()
    while True:
        item = q.get()
        if item is None:
            break

        if last_sent_time is None or now - last_sent_time >= timedelta(seconds=30):
            prediction_data, buffer = item
            accelerometer_data = accelerometer_queue.get()
            prediction_data['accelerometer_data'] = accelerometer_data
            prediction_data_json = json.dumps(prediction_data)

            in_memory_file = BytesIO(buffer)
            files = {'file': ('current_frame.jpg', in_memory_file, 'image/jpeg')}
            data = {
                'prediction_data': prediction_data_json,
                'username': 'ab7zz',
                'PRIV_KEY': PRIV_KEY
            }

            response = requests.post(url, files=files, data=data)

            if response.status_code == 200:
                print("Request sent successfully.")
                res = json.loads(response.text)
                print(f"Data IPFS ID: {res['dataIPFSid']}")
                print(f"Image IPFS ID: {res['imgIPFSid']}")
                print(f"Transaction Hash: {res['txHash']}")
                last_sent_time = now
            else:
                print("Error:", response.status_code)

        q.task_done()

request_thread = threading.Thread(target=post_request)
request_thread.start()

while(cap.isOpened):
    
    frame_count += 1  
    ret, frame = cap.read()
    if ret:
        
        orig_image = frame
        
        image = cv2.cvtColor(orig_image, cv2.COLOR_BGR2RGB)
        image = letterbox(image, (frame_width), stride=64, auto=True)[0]
        image_ = image.copy()
        image = transforms.ToTensor()(image)
        image = torch.tensor(np.array([image.numpy()]))
        
        image = image.half().to(device)  
        
        with torch.no_grad():
            output, _ = model(image)

        output = non_max_suppression(output, 0.25, 0.65, nc=model.yaml['nc'], nkpt=model.yaml['nkpt'], kpt_label=True)
        output = output_to_target(output)
        im0 = image[0].permute(1, 2, 0) * 255
        im0 = im0.cpu().numpy().astype(np.uint8)
        
        im0 = cv2.cvtColor(im0, cv2.COLOR_RGB2BGR)
        for idx in range(output.shape[0]):
            left_shoulder_y= output[idx][23]
            left_shoulder_x= output[idx][22]
            right_shoulder_y= output[idx][26]
            
            left_body_y = output[idx][41]
            left_body_x = output[idx][40]
            right_body_y = output[idx][44]

            len_factor = math.sqrt(((left_shoulder_y - left_body_y)**2 + (left_shoulder_x - left_body_x)**2 ))

            left_foot_y = output[idx][53]
            right_foot_y = output[idx][56]
            
            if left_shoulder_y > left_foot_y - len_factor and left_body_y > left_foot_y - (len_factor / 2) and left_shoulder_y > left_body_y - (len_factor / 2):
              fallen = True
              if fallen and not sent:
                now = datetime.now()
                timestamp = str(int(now.timestamp()))
                date = now.strftime('%d-%m-%Y')
                _, buffer = cv2.imencode('.jpg', im0)
                prediction_data = {
                  'username': 'SURA',
                  'timestamp': timestamp,
                  'date': date,
                  'status': 'fallen',
                }

                fall_ref.set(prediction_data)

                q.put((prediction_data, buffer))

                sent = True
            else:
               sent = False
               fallen = False
        cv2.imshow('image', im0)
        cv2.waitKey(1)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    else:
        break

stop_ble_reading_event.set()
accelerometer_thread.join()

q.put(None)
request_thread.join()

cap.release()
cv2.destroyAllWindows()

# Function to send the authentication key using BleakClient
async def send_authentication_key(address, auth_key):
    try:
        async with BleakClient(address) as client:
            if not await client.is_connected():
                await client.connect()
                print("Connected to the Arduino Nano BLE Sense Lite.")
            else:
                print("Already connected to the Arduino Nano BLE Sense Lite.")

            # Send the authentication key to the characteristic
            await client.write_gatt_char(CHAR_UUID, auth_key.encode())
            print(f"Sent authentication key '{auth_key}' to the Arduino Nano BLE Sense Lite.")
        
        return True
    
    except BleakError as e:
        print(f"Error during BLE communication: {str(e)}")
        return False

# Define a POST endpoint at /privkey
@app.route('/privkey', methods=['POST'])
async def privkey():
    try:
        # Parse the JSON data from the request body
        data = request.get_json()
        priv_key = data.get('privKey')

        PRIV_KEY = priv_key

        # Check if privKey is provided
        if not priv_key:
            return jsonify({'error': 'Missing privKey in request body'}), 400

        print(f"Received private key '{priv_key}' from the client.")
        
        # Send the authentication key using the send_authentication_key function
        success = await send_authentication_key(address, priv_key)

        if success:
            return jsonify({'message': f'Successfully sent authentication key to the Arduino Nano BLE Sense Lite'}), 200
        else:
            return jsonify({'error': 'Failed to send authentication key to the Arduino Nano BLE Sense Lite'}), 500

    except Exception as e:
        # Handle any unexpected errors
        print(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True, port=8000)