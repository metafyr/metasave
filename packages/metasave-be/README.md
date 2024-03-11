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
/falldata
```
?dataIPFSid={cid}&imgIPFSid={cid}
```

## UserDetails
POST
/user
```
body : {
       CF: CFAddress,
       name: 'Abhinav C V',
       age: 20,
       gender: 'Male',
       phone: "+91987654321",
       medications: "none",
       address: "dubai",
       contacts: "none",
       disease: "none",
       duration: "none"
}
```

GET 
/user/{cid}

## MerkleTree
POST
/merkletree
```

body : {
    
    walletAddress 
    msg 
}
```



