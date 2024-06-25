const express = require('express')
const app = express()

const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')

const adminRoute = require('./routes/adminRoute')
const movieRoute = require('./routes/movieRoute')
const imageRoute = require('./routes/imageRoute')

const {PORT} = require('./configuration/config')
const connect = require('./database/connection')

// app.use(cors())
app.use(cors({
    origin: 'http://localhost:5173', 
    // origin: 'https://movie-rating-eta.vercel.app/*', 
    credentials: true
}))
// app.options('*', cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'images')))

app.get('/', (request, response) => {
    response.status(200).send({ message: "It's working"})
})

app.use('/api/v1/admin', adminRoute)
app.use('/api/v1/movie', movieRoute)
app.use('/api/v1/public/images', imageRoute)

connect() 
    .then( () => {
        try{
            app.listen(PORT, console.log(`Server is running at http://localhost:${PORT}`))
        } 
        catch(error) {
            console.log(`Can't connect to database : ${error}`)
        }
    })
    .catch(error => {
        console.log(`Error while connecting to database : ${error}`)
    })