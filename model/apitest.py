import json
import requests

url = 'http://localhost:5000/api/fall'

prediction_data = {
    'username': 'TERRYMON',
    'timestamp': '12:40pm',
    'date': '12-04-2024',
    'status': 'fallen'
}
prediction_data_json = json.dumps(prediction_data)

file_name = 'model/fall.jpg'
with open(file_name, 'rb') as f:
    files = {'file': (file_name, f.read())}

data = {
    'prediction_data': prediction_data_json,
    'username': 'ab7zz',
    'PRIV_KEY': '123456'
}

response = requests.post(url, files=files, data=data)

if response.status_code == 200:
    print("Request sent successfully.")
    res = json.loads(response.text)
    print(res['dataIPFSid'], res['imgIPFSid'])
else:
    print("Error:", response.status_code)
