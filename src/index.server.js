// Node Modules
const express = require('express')
const env = require('dotenv')
const app = express();
const mongoose = require('mongoose')
const path = require('path')
const cors = require("cors")

// routes
const authRoutes = require("./routes/auth")
const adminRoutes = require("./routes/admin/auth")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const cartRoutes = require("./routes/cart")
const addressRoutes = require("./routes/address")
const orderRoutes = require("./routes/order")
const adminOrderRoutes = require("./routes/admin/order")
const initialDataRoutes = require("./routes/admin/initialData")
const newPageRoutes = require("./routes/admin/page")

// Environment variable or you can say constants
env.config();

// MongoDB Connection
const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@cluster0.yiuxu.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

// mongoose.connect(
//     MONGODB_URI, 
//     {
//         useNewUrlParser : true,
//         useUnifiedTopology : true,
//         useCreateIndex : true,
//         useFindAndModify : false
//     }
// ).then(() => {
//     console.log("Database Connected");
// })

// Using middleware
app.use(cors());
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, 'uploads')));
    
// endpoint '/api' using express router
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', addressRoutes);
app.use('/api', orderRoutes);
app.use('/api', adminOrderRoutes);
app.use('/api', initialDataRoutes);
app.use('/api', newPageRoutes);

app.get("/", (req, res) => {
    res.send("This page loads when making GET / request to the Backend Server")
})

// Listening to the server on below port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`)
    console.log(`Following are the mongoDB details : `)
    console.log(`User : ${process.env.MONGODB_USER} and DB : ${process.env.MONGODB_DATABASE}`)
});