const express = require('express');
const awsServerlessExpress = require('aws-serverless-express');
const axios = require("axios")

const app = express();

app.get('/', (req, res) => {
  var reqdata = req.body
  res.send(req)
  var options = {
    method: 'POST',
      url: 'https://graph.facebook.com/v17.0/180851955102577/messages',
      headers: {
        Authorization: 'Bearer EAAJovKnszKkBO6FeUGNZAuagWQZBvXQw4kriC1HuZABPdUkYdI4d4RNZCBwcd35Uz5acmReY68zAMSh1rxw4tuRQTx2BBOLMPe6mkdwvQQwzxtdXeWC9xy8wCHf1n4zBxNgyOTDt7HFgnxCgGu6o0dcuSrxEZACPyuulvvra6t93ZC4msYRtYx5ZAmwOlMM2cih6pSEeTHUnbxMkr89rLIZD',
        'Content-Type': 'application/json'
      },
      data: {
        messaging_product: 'whatsapp',
        to: '919188020170',
        type: 'template',
        template: {
          name: 'alert', 
          language: {code: 'en'},
          components: [
            {
              "type": "header",
              "parameters": [
                {
                  "type": "image",
                  "image": {
                    "link": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfntmfcua0MmAbzlL8XeTZLSg5HGb0SDCzOQ&usqp=CAU",
                  }
                }
              ]
            },
            {
              "type": "body",
              "parameters": [
                {
                  "type": "text",
                  "text": reqdata["name"]
                },
                {
                  "type": "text",
                  "text": "15:44 AM"
                },
                {
                  "type": "text",
                  "text": "2023-12-20"
                }
              ]
            }
          ]
        }
      }
    };
    
    axios.request(options).then(function (response) {
      console.log(response.data);
      res.send(response.data);
    }).catch(function (error) {
      console.error(error);
      res.send(error);
    });
});

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};

