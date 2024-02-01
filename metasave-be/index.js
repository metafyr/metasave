import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes/index.js'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000

const allowedOrigins = ['http://localhost:5173'];

const corsOptions = {
    origin: function (origin, callback) {
      // Check if the origin is in the allowedOrigins array or if it's undefined (not set)
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
};

app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions));
app.options('*', cors())
app.get('/', (req, res) => {
    res.send('Metasave server')
})
app.use('/api', routes)

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`))