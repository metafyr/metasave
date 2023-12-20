import cv2
import mediapipe as mp
import math
import encryption as me

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

def predict_fall(pose_landmarks):
    # Check if pose landmarks are available
    if not pose_landmarks.landmark:
        return False

    # Extract relevant landmark coordinates
    shoulder_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    hip_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP.value]
    knee_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_KNEE.value]
    ankle_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_ANKLE.value]
    
    # Check if the person is leaning forward or backward
    torso_angle = calculate_torso_angle(pose_landmarks)
    print(torso_angle)
    if torso_angle < 30 or torso_angle > 150:
        return True

    # Check if the person's center of mass is significantly shifted towards their toes
    center_of_mass_x = (shoulder_landmark.x + hip_landmark.x) / 2
    if center_of_mass_x > ankle_landmark.x:
        return True

    # Check if the person's legs are not firmly planted on the ground
    leg_angle = calculate_leg_angle(pose_landmarks)
    print(leg_angle)
    # if leg_angle < 120:
    #     return True

    return False

def calculate_leg_angle(pose_landmarks):
    # Extract relevant landmark coordinates
    hip_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP.value]
    knee_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_KNEE.value]
    ankle_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_ANKLE.value]

    # Calculate the thigh and calf vectors
    thigh_vector = (knee_landmark.x - hip_landmark.x, knee_landmark.y - hip_landmark.y)
    calf_vector = (ankle_landmark.x - knee_landmark.x, ankle_landmark.y - knee_landmark.y)

    # Calculate the dot product and magnitudes of the vectors
    dot_product = thigh_vector[0] * calf_vector[0] + thigh_vector[1] * calf_vector[1]
    magnitude_thigh_vector = ((thigh_vector[0])**2 + (thigh_vector[1])**2)**0.5
    magnitude_calf_vector = ((calf_vector[0])**2 + (calf_vector[1])**2)**0.5

    # Calculate the angle between the thigh and calf
    angle = math.acos(dot_product / (magnitude_thigh_vector * magnitude_calf_vector))
    angle = math.degrees(angle)

    return angle

def is_fallen(pose_landmarks):
    if not pose_landmarks.landmark:
        return False, False

    hip_y = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP.value].y
    knee_y = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_KNEE.value].y
    ankle_y = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_ANKLE.value].y
    torso_angle = calculate_torso_angle(pose_landmarks)

    # Check if the person is in a supine position based on leg and torso angle criteria
    fall_detected = hip_y < knee_y < ankle_y and torso_angle >= 90

    return False, fall_detected

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

def main():
    i = 0
    cap = cv2.VideoCapture(0)
    fall_predicted = False
    fall_detected = False

    t = "23:11:30"
    d = "12/12/2023"
    
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

                # Predict fall
                if not fall_predicted:
                    fall_predicted = predict_fall(results.pose_landmarks)

                # Detect fall
                if not fall_detected:
                    _, fall_detected = is_fallen(results.pose_landmarks)

                if fall_predicted and fall_detected:
                    import base64
                    jpg_img = cv2.imencode('.jpg', frame)
                    b64_string = base64.b64encode(jpg_img[1]).decode('utf-8')
                    print(b64_string)
                    me.homoenc(1,1,b64_string)

            cv2.imshow('Pose Estimation', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()