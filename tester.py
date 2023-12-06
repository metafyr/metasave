import cv2
import numpy as np
from ultralytics import YOLO

def calculate_head_turn_angle(frame, model_path="Pose-Estimation\yolov8s-pose.pt"):
    # Load the YOLO pose model
    model = YOLO(model_path)

    # Define body part indices
    body_index = {
        "nose": 0,
        "left_eye": 1,
        "right_eye": 2,
        # ... (other body parts)
        "right_ankle": 16,
    }

    # Function to calculate angle between three points
    def calculate_angle(a, b, c):
        ba = a - b
        bc = c - b
        cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
        angle = np.arccos(cosine_angle) * 180 / np.pi
        return angle

    # Detect poses using YOLOv8
    results = model(frame, verbose=False, conf=0.5)
    annotated_frame = results[0].plot()

    # Extract body part coordinates for each person
    if len(results) == 1:
        human = results[0].keypoints

        # Continue calculating angles
        left_eye = human.xy[0][body_index["left_eye"]].detach().cpu().numpy()
        right_eye = human.xy[0][body_index["right_eye"]].detach().cpu().numpy()
        nose = human.xy[0][body_index["nose"]].detach().cpu().numpy()

        head_turn_angle = calculate_angle(left_eye, nose, right_eye)
        return head_turn_angle
    else:
        return None

# Open the webcam
cap = cv2.VideoCapture(0)

while cap.isOpened():
    success, frame = cap.read()

    if success:
        head_turn_angle = calculate_head_turn_angle(frame)
        print(head_turn_angle)
        cv2.imshow("This Is What She Looked Like", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

# Release the webcam and close all windows
cap.release()
cv2.destroyAllWindows()