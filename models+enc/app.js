import axios from 'axios'

const predictionData = {
    'username':'TERRYMON',
    'timestamp':'12321123124',
    'date': '19/12/2023',
    'imagedata':'432unu3r2jndjn32',
    'status':'fallen'
};

axios.post('https://91ln5ijl3i.execute-api.eu-north-1.amazonaws.com/new/alert',predictionData,{
    headers:{
        'Content_Type': 'application/json'}
    })

    .then(response => {
      console.log(response.data);
   })

   .catch(error =>{
    console.error('Error sending data to server:',error.message);
   });