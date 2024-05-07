import json
import requests
from dotenv import dotenv_values

env_vars = dotenv_values()

PRIV_KEY = env_vars["PRIV_KEY"]

url = 'http://localhost:5000/api/fall'

prediction_data = { 
    'username': 'ab7zz',
    'timestamp': '12:40pm',
    'date': '07-05-2024',
    'status': 'fallen'
}
prediction_data_json = json.dumps(prediction_data)

file_name = './fall.jpg'
files = ''
try:
    with open(file_name, 'rb') as f:
        files = {'file': (file_name, f.read())}
except FileNotFoundError:
    print(f"File not found: {file_name}")
except Exception as e:
    print(f"An error occurred: {e}")

data = {
    'prediction_data': prediction_data_json,
    'USERNAME': 'ab7zz',
    'PRIV_KEY': PRIV_KEY,
    'DEVICE_ID': 5467
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
