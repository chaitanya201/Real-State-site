const express = require("express")
const cors = require("cors")
const userRoutes = require('./Routes/userRoutes')
const propertyRoutes = require('./Routes/propertyRoutes')
const PORT = 5000

const app = express()

//
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use('/profile-pic', express.static( './public/UserProfile'))
app.use('/profile-pic', express.static( './public/static'))
app.use('/property-images', express.static('./public/PropertyImages'))

// starting the server
app.listen(PORT, (err) => {
    if(err) {
        console.log("error while starting the app ");
        
    } else {
        console.log(`server started at port ${PORT}`);
    }
})

// define custom routes here

app.use('/property', propertyRoutes)
app.use('/user', userRoutes)