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

q = queue.Queue()

def post_request():
    global last_sent_time
    now = datetime.now()
    while True:
        item = q.get()
        if item is None:
            break

        if last_sent_time is None or now - last_sent_time >= timedelta(seconds=30):
            prediction_data, buffer = item
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
                  'username': 'TERRYMON',
                  'timestamp': timestamp,
                  'date': date,
                  'status': 'fallen'
                }

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

q.put(None)
request_thread.join()

cap.release()
cv2.destroyAllWindows()
