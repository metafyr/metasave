npm run dev

# Routes

API URL = http://localhost:5000/api

## Fall
POST    
/fall   
```
body: {
    'prediction_data': {
        'username': 'ab7zz',
        'timestamp': '12:40pm',
        'date': '12-04-2024',
        'status': 'fallen'
    },
    'username': 'ab7zz',
    'PRIV_KEY': PRIV_KEY
}
file: attach_file
```

GET
/fall
```
?dataIPFSid={cid}&imgIPFSid={cid}
```