import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const GRAPH_API_TOKEN = process.env.GRAPH_API_TOKEN

const sendMessage = (img, name, contact, time, date) => {
  var options = {
    method: 'POST',
    url: 'https://graph.facebook.com/v17.0/180851955102577/messages',
    headers: {
      Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    data: {
      messaging_product: 'whatsapp',
      to: `${contact}`,
      type: 'template',
      template: {
        name: 'alert',
        language: { code: 'en' },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'image',
                image: {
                  link: `${img}`,
                },
              },
            ],
          },
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: `${name}`,
              },
              {
                type: 'text',
                text: `${time}`,
              },
              {
                type: 'text',
                text: `${date}`,
              },
            ],
          },
        ],
      },
    },
  }

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data)
      return true
    })
    .catch(function (error) {
      console.error(error)
      return false
    })
}

export default sendMessage
