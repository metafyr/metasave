import torch
import cv2
import math
from torchvision import transforms
import numpy as np
from utils.datasets import letterbox
from utils.general import non_max_suppression
from utils.plots import output_to_target, plot_skeleton_kpts
import requests
from datetime import datetime
import base64

# scheduled to run on GPU by default
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
weights = torch.load('yolov7-w6-pose.pt')
model = weights['model']
model = model.half().to(device)
_ = model.eval()

video_path = "fall.mp4"
cap = cv2.VideoCapture(video_path)

if (cap.isOpened() == False):
    print('Error while trying to read video. Please check path again')

frame_width = int(cap.get(3))
print(frame_width)
frame_height = int(cap.get(4))
print(frame_height)
frame_count = 0

while(cap.isOpened):
    
    frame_count += 1  
    ret, frame = cap.read()
    if ret:
        
        #store frame
        orig_image = frame
        
        #convert frame to RGB
        image = cv2.cvtColor(orig_image, cv2.COLOR_BGR2RGB)
        image = letterbox(image, (frame_width), stride=64, auto=True)[0]
        image_ = image.copy()
        image = transforms.ToTensor()(image)
        image = torch.tensor(np.array([image.numpy()]))
        
        #convert image data to device
        image = image.half().to(device)  
        
        #get predictions
        with torch.no_grad():
            output, _ = model(image)

        #Apply non max suppression
        output = non_max_suppression(output, 0.25, 0.65, nc=model.yaml['nc'], nkpt=model.yaml['nkpt'], kpt_label=True)
        output = output_to_target(output)
        im0 = image[0].permute(1, 2, 0) * 255
        im0 = im0.cpu().numpy().astype(np.uint8)
        
        #reshape image format to (BGR)
        im0 = cv2.cvtColor(im0, cv2.COLOR_RGB2BGR)
        for idx in range(output.shape[0]):
            plot_skeleton_kpts(im0, output[idx, 7:].T, 3)
            xmin, ymin = (output[idx, 2]-output[idx, 4]/2), (output[idx, 3]-output[idx, 5]/2)
            xmax, ymax = (output[idx, 2]+output[idx, 4]/2), (output[idx, 3]+output[idx, 5]/2)

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
            # Plotting key points and text on frame
              cv2.rectangle(im0,(int(xmin), int(ymin)),(int(xmax), int(ymax)),color=(0, 0, 255),
                  thickness=5,lineType=cv2.LINE_AA)
              cv2.putText(im0, 'Person Fell down', (11, 100), 0, 1, [0, 0, 2550], thickness=3, lineType=cv2.LINE_AA)
              now = datetime.now()
              timestamp = str(int(now.timestamp()))
              date = now.strftime('%d/%m/%Y')
              _, buffer = cv2.imencode('.jpg', im0)
              im0_base64 = base64.b64encode(buffer).decode('utf-8')
              prediction_data = {
                    'username': 'TERRYMON',
                    'timestamp': timestamp,
                    'date': date,
                    'imagedata': im0_base64,
                    'status': 'fallen'
                }
              response = requests.post(
                    'https://91ln5ijl3i.execute-api.eu-north-1.amazonaws.com/new/alert',
                    json=prediction_data
                )
              if response.ok:
                    print("Success:", response.json())
              else:
                    print("Error:", response.text)
        
        cv2.imshow('image', im0)
        cv2.waitKey(1)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    else:
        break

cap.release()
cv2.destroyAllWindows()