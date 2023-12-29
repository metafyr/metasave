import cv2
import mediapipe as mp
import math
import encryption as me
from datetime import datetime
import base64
import requests

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

def calculate_torso_angle(pose_landmarks):
    nose_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.NOSE.value]
    shoulder_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    hip_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP.value]

    shoulder_vector = (shoulder_landmark.x - nose_landmark.x, shoulder_landmark.y - nose_landmark.y)
    hip_vector = (hip_landmark.x - nose_landmark.x, hip_landmark.y - nose_landmark.y)

    dot_product = shoulder_vector[0] * hip_vector[0] + shoulder_vector[1] * hip_vector[1]
    magnitude_shoulder_vector = ((shoulder_vector[0])**2 + (shoulder_vector[1])**2)**0.5
    magnitude_hip_vector = ((hip_vector[0])**2 + (hip_vector[1])**2)**0.5

    angle = math.acos(dot_product / (magnitude_shoulder_vector * magnitude_hip_vector))
    angle = math.degrees(angle)

    return angle

def calculate_leg_angle(pose_landmarks):
    # hip, knee and angle landmarks
    hip_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP.value]
    knee_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_KNEE.value]
    ankle_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_ANKLE.value]

    # thigh and calf vectors
    thigh_vector = (knee_landmark.x - hip_landmark.x, knee_landmark.y - hip_landmark.y)
    calf_vector = (ankle_landmark.x - knee_landmark.x, ankle_landmark.y - knee_landmark.y)

    # dot product and magnitudes of the vectors
    dot_product = thigh_vector[0] * calf_vector[0] + thigh_vector[1] * calf_vector[1]
    magnitude_thigh_vector = ((thigh_vector[0])**2 + (thigh_vector[1])**2)**0.5
    magnitude_calf_vector = ((calf_vector[0])**2 + (calf_vector[1])**2)**0.5

    # angle between the thigh and calf
    angle = math.acos(dot_product / (magnitude_thigh_vector * magnitude_calf_vector))
    angle = math.degrees(angle)

    return angle
def predict_fall(pose_landmarks):
    # Landmarks extraction
    shoulder_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    hip_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP.value]
    ankle_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_ANKLE.value]
    nose_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.NOSE.value]
    knee_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_KNEE.value]
    
    # If nose, shoulder, hip, knee and ankle landmarks are visible
    if nose_landmark.visibility > 0.5 and shoulder_landmark.visibility > 0.5 and hip_landmark.visibility > 0.5  and knee_landmark.visibility > 0.5 and ankle_landmark.visibility > 0.5:
        torso_angle = calculate_torso_angle(pose_landmarks)
        print(f"Torso Angle: {torso_angle}")
        if torso_angle < 30 or torso_angle > 150:
            return True

        # Is the person's center of mass shifted towards their toes?
        center_of_mass_x = (shoulder_landmark.x + hip_landmark.x) / 2
        if center_of_mass_x > ankle_landmark.x:
            return True

        # Are the person's legs firmly planted on the ground?
        leg_angle = calculate_leg_angle(pose_landmarks)
        print(f"Leg Angle: {leg_angle}")
        if leg_angle < 120:
            return True
    else:
        print("Not all landmarks are visible")

    return False

def is_fallen(pose_landmarks):
    if not pose_landmarks.landmark:
        return False

    hip_y = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP.value].y
    knee_y = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_KNEE.value].y
    ankle_y = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_ANKLE.value].y

    torso_angle = calculate_torso_angle(pose_landmarks)

    # Checking if the person is in supine position (ie laying on belly or on back)
    fall_detected = hip_y < knee_y < ankle_y and torso_angle >= 90

    return fall_detected

def main():
    cap = cv2.VideoCapture(0)
    
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                continue

            frame = cv2.flip(frame, 1)
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(rgb_frame)

            if results.pose_landmarks:
                mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

                if predict_fall(results.pose_landmarks) and is_fallen(results.pose_landmarks):
                    print("Fall!")
                    jpg_img = cv2.imencode('.jpg', frame)
                    b64_string = base64.b64encode(jpg_img[1]).decode('utf-8')
                    print("Fallen!")
                    current_time = datetime.now()
                    predictionData = {
                        'username':'mishal',
                        'timestamp':current_time.strftime("%H:%M:%S"),
                        'date': current_time.strftime("%Y-%m-%d"),
                        'imagedata':b64_string,
                        'status':'fallen'
                    };
                     
                    url = 'https://91ln5ijl3i.execute-api.eu-north-1.amazonaws.com/new/alert'
                    headers = {'Content-Type': 'application/json'}

                    try:
                        response = requests.post(url, json=predictionData, headers=headers)
                        response_data = response.json()
                        print(response_data)
                    except requests.exceptions.RequestException as e:
                        print('Error sending data to server:', e)

            cv2.imshow('Pose Estimation', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()