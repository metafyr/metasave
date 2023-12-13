import cv2
import numpy as np
from ultralytics import YOLO

model = YOLO("Pose-Estimation\yolov8s-pose.pt")
urmompussy = cv2.VideoCapture(0)
body_index = {
    "nose": 0,
    "left_eye": 1,
    "right_eye": 2,
    "left_ear": 3,
    "right_ear": 4,
    "left_shoulder": 5,
    "right_shoulder": 6,
    "left_elbow": 7,
    "right_elbow": 8,
    "left_wrist": 9,
    "right_wrist": 10,
    "left_hip": 11,
    "right_hip": 12,
    "left_knee": 13,
    "right_knee": 14,
    "left_ankle": 15,
    "right_ankle": 16,
}

def calculate_angle(me, urmom, urdad):
    u = me - urmom
    uagain = urdad - urmom
    cosine_angle = np.dot(u, uagain) / (np.linalg.norm(u) * np.linalg.norm(uagain))
    urass = np.arccos(cosine_angle) * 180 / np.pi
    return urass

while urmompussy.isOpened():
    success, frame = urmompussy.read()

    if success:
        results = model(frame, verbose=False, conf=0.5)
        annotated_frame = results[0].plot()

        if len(results) == 1:
            human = results[0].keypoints

            left_shoulder = human.xy[0][body_index["left_shoulder"]].detach().cpu().numpy()
            left_elbow = human.xy[0][body_index["left_elbow"]].detach().cpu().numpy()
            left_wrist = human.xy[0][body_index["left_wrist"]].detach().cpu().numpy()
            left_hip = human.xy[0][body_index["left_hip"]].detach().cpu().numpy()

            right_shoulder = human.xy[0][body_index["right_shoulder"]].detach().cpu().numpy()
            right_elbow = human.xy[0][body_index["right_elbow"]].detach().cpu().numpy()
            right_wrist = human.xy[0][body_index["right_wrist"]].detach().cpu().numpy()
            right_hip = human.xy[0][body_index["right_hip"]].detach().cpu().numpy()

            left_bicep_angle = calculate_angle(left_shoulder, left_elbow, left_wrist)
            left_pit_angle = calculate_angle(left_hip, left_shoulder, left_elbow)

            right_bicep_angle = calculate_angle(right_shoulder, right_elbow, right_wrist)
            right_pit_angle = calculate_angle(right_hip, right_shoulder, right_elbow)

            angles = []
            angles.append((left_bicep_angle, left_pit_angle, right_bicep_angle, right_pit_angle))
            print(angles)

            # cv2.putText(annotated_frame, "Left Bicep Angle" + str(left_bicep_angle), (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
            # cv2.putText(annotated_frame, "Left Pit Angle: " + str(left_pit_angle), (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

            # cv2.putText(annotated_frame, "Right Bicep Angle: " + str(right_bicep_angle), (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
            # cv2.putText(annotated_frame, "Right Pit Angle: " + str(right_pit_angle), (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

            cv2.imshow("This Is What She Looked Like", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
            break

# Release the webcam and close all windows
urmompussy.release()
cv2.destroyAllWindows()