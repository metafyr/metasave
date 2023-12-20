import cv2
import mediapipe as mp
import math

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

def is_fallen(pose_landmarks):
    if not pose_landmarks.landmark:
        return False

    # Adjust these values based on your specific criteria
    hip_y = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP.value].y
    knee_y = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_KNEE.value].y
    ankle_y = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_ANKLE.value].y
    torso_angle = calculate_torso_angle(pose_landmarks)

    # Check if the person is in a supine position based on leg and torso angle criteria
    if hip_y < knee_y < ankle_y and torso_angle >= 90:
        return True
    else:
        return False

def calculate_torso_angle(pose_landmarks):
    # Get the landmarks of the nose, shoulder, hip, and knee
    nose_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.NOSE.value]
    shoulder_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    hip_landmark = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP.value]

    # Calculate the vectors from the nose to the shoulder and from the nose to the hip
    shoulder_vector = (shoulder_landmark.x - nose_landmark.x, shoulder_landmark.y - nose_landmark.y)
    hip_vector = (hip_landmark.x - nose_landmark.x, hip_landmark.y - nose_landmark.y)

    # Calculate the dot product of the two vectors
    dot_product = shoulder_vector[0] * hip_vector[0] + shoulder_vector[1] * hip_vector[1]

    # Calculate the magnitude of the two vectors
    magnitude_shoulder_vector = ((shoulder_vector[0])**2 + (shoulder_vector[1])**2)**0.5
    magnitude_hip_vector = ((hip_vector[0])**2 + (hip_vector[1])**2)**0.5

    # Calculate the angle between the two vectors using the dot product and the magnitudes of the vectors
    angle = math.acos(dot_product / (magnitude_shoulder_vector * magnitude_hip_vector))

    # Convert the angle to degrees
    angle = math.degrees(angle)

    return angle

def main():
    i=0
    cap = cv2.VideoCapture(0)
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                continue

            # Flip the image horizontally for a later selfie-view display
            frame = cv2.flip(frame, 1)

            # Convert the BGR image to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # Set flag to only run the pose estimation on one frame per second
            results = pose.process(rgb_frame)

            if results.pose_landmarks:
                mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

                # Check if the person has fallen
                if is_fallen(results.pose_landmarks):
                    print("Fall detected!")
                    return 1

            cv2.imshow('Pose Estimation', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()