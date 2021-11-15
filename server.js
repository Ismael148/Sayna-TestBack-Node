const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Load all Routes
const authRoutes = require('./server/routes/auth');
const userRouter = require('./server/routes/user')

// App
const app = express();

// Database connection
const dbConnect = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};
mongoose.connect(process.env.DATABASE, dbConnect);
console.log(`MongoDB Connecté`)

//middlewares
app.use(bodyParser.json());
app.use(cors());



//routes middleware
app.use('/api', authRoutes);
app.use('/api', userRouter);

// Server Production
if(process.env.NODE_ENV === "production")  {
    db = process.env.DATABASE
    app.use(express.static(path.join("client/build")))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
 console.log(`Le serveur est lancé en mode  ${process.env.NODE_ENV} sur le port ${PORT}`)
});