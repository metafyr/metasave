from flask import Flask, request, jsonify
from flask_cors import CORS
from bleak import BleakClient, BleakError
import threading
import queue
from datetime import datetime
import asyncio
import requests
import json
import cv2
from io import BytesIO
from dotenv import dotenv_values

env_vars = dotenv_values()

# Create a Flask application
app = Flask(__name__)

# Enable CORS for all routes in the application
CORS(app)

PRIV_KEY = env_vars["PRIV_KEY"]
ADDRESS = "E0:F7:BF:E9:2B:7C"
SERVICE_UUID = "12345678-1234-5678-9abc-def012345678"
CHAR_UUID = "12345678-1234-5678-9abc-def012345679"

url = 'http://localhost:5000/api/fall'  


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

                    prediction_data = {
                        'username': 'SURA',
                        'timestamp': timestamp,
                        'date': date,
                        'status': 'fallen',
                        'accelerometer_data': "fallen"
                    }

                    im0 = cv2.imread("fall.jpg")
                    _, buffer = cv2.imencode('.jpg', im0)
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
                    else:
                        print("Error:", response.status_code)
            except Exception as e:
                print(f"Error: {e}")
            await asyncio.sleep(0.1)

def read_accel_data(address):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(read_characteristics(address, stop_ble_reading_event))

accelerometer_thread = threading.Thread(target=read_accel_data, args=(ADDRESS,))
accelerometer_thread.start()

stop_ble_reading_event.set()
accelerometer_thread.join()

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

        # Check if privKey is provided
        if not priv_key:
            return jsonify({'error': 'Missing privKey in request body'}), 400

        print(f"Received private key '{priv_key}' from the client.")
        
        # Send the authentication key using the send_authentication_key function
        success = await send_authentication_key(ADDRESS, priv_key)

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