import cv2
import mediapipe as mp
import math
import tenseal as ts
import base64
from datetime import datetime
import requests

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Mapping of body parts to index
body_index = {
    "nose": 0,
    "left_eye_inner": 1,
    "left_eye": 2,
    "left_eye_outer": 3,
    "right_eye_inner": 4,
    "right_eye": 5,
    "right_eye_outer": 6,
    "left_ear": 7,
    "right_ear": 8,
    "mouth_left": 9,
    "mouth_right": 10,
    "left_shoulder": 11,
    "right_shoulder": 12,
    "left_elbow": 13,
    "right_elbow": 14,
    "left_wrist": 15,
    "right_wrist": 16,
    "left_pinky": 17,
    "right_pinky": 18,
    "left_index": 19,
    "right_index": 20,
    "left_thumb": 21,
    "right_thumb": 22,
    "left_hip": 23,
    "right_hip": 24,
    "left_knee": 25,
    "right_knee": 26,
    "left_ankle": 27,
    "right_ankle": 28,
    "left_heel": 29,
    "right_heel": 30,
    "left_foot_index": 31,
    "right_foot_index": 32
}

# Initialize Tenseal context and parameters
context = ts.context(ts.SCHEME_TYPE.CKKS, poly_modulus_degree = 8192, coeff_mod_bit_sizes = [60, 40, 40, 60])
context.generate_galois_keys()
context.global_scale = 2 ** 40
secret_context = context.serialize(save_secret_key=True)

# Function to encrypt pose landmarks using Tenseal
def encrypt_landmarks(landmarks):
    encrypted_landmarks = []
    for landmark in landmarks:
        encrypted_x = ts.ckks_vector(context, [landmark.x])
        encrypted_y = ts.ckks_vector(context, [landmark.y])
        encrypted_landmarks.append((encrypted_x, encrypted_y))
    return encrypted_landmarks

# Modify the functions to use encrypted landmarks by index
def predict_fall(pose_landmarks):
    # Check if pose landmarks are available
    if not pose_landmarks:
        return False

    # Extract relevant landmark coordinates
    shoulder_landmark = pose_landmarks[body_index["left_shoulder"]]
    hip_landmark = pose_landmarks[body_index["left_hip"]]
    knee_landmark = pose_landmarks[body_index["left_knee"]]
    ankle_landmark = pose_landmarks[body_index["left_ankle"]]
    nose_landmark = pose_landmarks[body_index["nose"]]

     # Check if the person is leaning forward or backward
    torso_angle = calculate_torso_angle(pose_landmarks)
    if torso_angle < 30 or torso_angle > 150:
        return True

    # Check if the person's center of mass is significantly shifted towards their toes
    center_of_mass_x = (shoulder_landmark[0]+hip_landmark[0]).decrypt()[0] / 2
    if center_of_mass_x > ankle_landmark[0].decrypt()[0]:
        return True

    # Check if the person's legs are not firmly planted on the ground
    leg_angle = calculate_leg_angle(pose_landmarks)
    if leg_angle < 120:
        return True
    return False

def calculate_leg_angle(pose_landmarks):
    # Extract relevant landmark coordinates
    hip_landmark = pose_landmarks[body_index["left_hip"]]
    knee_landmark = pose_landmarks[body_index["left_knee"]]
    ankle_landmark = pose_landmarks[body_index["left_ankle"]]

    # Calculate the thigh and calf vectors
    thigh_vector = (knee_landmark[0] - hip_landmark[0], knee_landmark[1] - hip_landmark[1])
    calf_vector = (ankle_landmark[0] - knee_landmark[0], ankle_landmark[1] - knee_landmark[1])

    # Calculate the dot product and magnitudes of the vectors
    dot_product = (thigh_vector[0] * calf_vector[0] + thigh_vector[1] * calf_vector[1])
    dot_product = dot_product.decrypt()[0]
    magnitude_thigh_vector = math.sqrt(thigh_vector[0].decrypt()[0]**2 + thigh_vector[1].decrypt()[0]**2)**0.5
    magnitude_calf_vector = math.sqrt(calf_vector[0].decrypt()[0]**2 + calf_vector[1].decrypt()[0]**2)**0.5

    # print(dot_product, magnitude_calf_vector, magnitude_thigh_vector)

    # Calculate the angle between the thigh and calf
    angle = math.acos(dot_product / (magnitude_thigh_vector * magnitude_calf_vector))
    angle = math.degrees(angle)

    return angle

def is_fallen(pose_landmarks):
    if not pose_landmarks:
        return False

    hip_y = pose_landmarks[body_index["left_hip"]][1]
    knee_y = pose_landmarks[body_index["left_knee"]][1]
    ankle_y = pose_landmarks[body_index["left_ankle"]][1]
    torso_angle = calculate_torso_angle(pose_landmarks)

    # Check if the person is in a supine position based on leg and torso angle criteria
    fall_detected = hip_y.decrypt()[0] < knee_y.decrypt()[0] < ankle_y.decrypt()[0] and torso_angle >= 90

    return fall_detected

def calculate_torso_angle(pose_landmarks):
    nose_landmark = pose_landmarks[body_index["nose"]]
    shoulder_landmark = pose_landmarks[body_index["left_shoulder"]]
    hip_landmark = pose_landmarks[body_index["left_hip"]]

    shoulder_vector = (shoulder_landmark[0] - nose_landmark[0], shoulder_landmark[1] - nose_landmark[1])
    hip_vector = (hip_landmark[0] - nose_landmark[0], hip_landmark[1] - nose_landmark[1])

    dot_product = (shoulder_vector[0] * hip_vector[0] + shoulder_vector[1] * hip_vector[1])
    dot_product = dot_product.decrypt()[0]
    magnitude_shoulder_vector = math.sqrt(shoulder_vector[0].decrypt()[0]**2 + shoulder_vector[1].decrypt()[0]**2)
    magnitude_hip_vector = math.sqrt(hip_vector[0].decrypt()[0]**2 + hip_vector[1].decrypt()[0]**2)

    # print(dot_product, magnitude_hip_vector, magnitude_shoulder_vector)

    angle = math.acos(dot_product / (magnitude_shoulder_vector * magnitude_hip_vector))
    angle = math.degrees(angle)

    return angle

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
                
                encrypted_landmarks = encrypt_landmarks(results.pose_landmarks.landmark)

                # Predict fall
                if predict_fall(encrypted_landmarks) and is_fallen(encrypted_landmarks):
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