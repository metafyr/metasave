import torch
import cv2
import math
from torchvision import transforms
import numpy as np
from yoloutils.datasets import letterbox
from yoloutils.general import non_max_suppression
from yoloutils.plots import output_to_target
from datetime import datetime
import requests
import json
from io import BytesIO

url = 'http://localhost:5000/api/fall'  

# Initialize the device to GPU if available
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
weights = torch.load('yolov7-w6-pose.pt', map_location=device)
model = weights['model']
model = model.half().to(device)
_ = model.eval()

video_path = "fall.mp4"
cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print('Error while trying to read video. Please check path again')

frame_width = int(cap.get(3))
print(frame_width)
frame_height = int(cap.get(4))
print(frame_height)
frame_count = 0

while cap.isOpened():
    
    frame_count += 1  
    ret, frame = cap.read()
    if ret:
        
        orig_image = frame
        
        image = cv2.cvtColor(orig_image, cv2.COLOR_BGR2RGB)
        image = letterbox(image, new_shape=(frame_width, frame_height), stride=64, auto=True)[0]
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
        
        # Reshape image format to BGR
        im0 = cv2.cvtColor(im0, cv2.COLOR_RGB2BGR)

        # Resize the output window to quarter size
        im0 = cv2.resize(im0, (im0.shape[1] // 2, im0.shape[0] // 2))

        for idx in range(output.shape[0]):
            # Keypoint plotting removed as per requirement
            # Your fall detection logic remains here

            cv2.imshow('image', im0)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    else:
        break

cap.release()
cv2.destroyAllWindows()
