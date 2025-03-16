const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const TestRouter = require("./routes/test");
const LoginRouter = require("./routes/login");
const SignupRouter = require("./routes/signup");
const LogoutRouter = require("./routes/logout");
const NewProductRouter = require("./routes/new_product");
const router = require("./routes/supplier")
const RawMaterialRouter = require("./routes/raw_material")
const transactionRouter = require("./routes/addTransaction")
const retailerRouter = require("./routes/retailer")
const userRouter = require("./routes/user_details")
const negotiationRouter = require('./routes/negotiation');
// const AddPostRouter = require("./routes/AddPost.routes");
// const GetPostRouter = require("./routes/GetPost.route");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Database Connection
connectDB();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Routes
app.use("/api/test", TestRouter);
app.use("/api/login", LoginRouter);
app.use("/api/signup", SignupRouter);
app.use("/api/logout", LogoutRouter);
app.use("/api/product/create",NewProductRouter)
app.use("/api/supplier",router)
app.use("/api/raw_material",RawMaterialRouter)
app.use("/api/transaction",transactionRouter)
app.use("/api/retailer",retailerRouter)
app.use("/api/user",userRouter)
app.use('/api/negotiate', negotiationRouter);
// app.use("/api/posts", AddPostRouter);
// app.use("/api/posts", GetPostRouter);

// MongoDB connection
// mongoose.connect(process.env.MONGODB_URI)
// .then(() => console.log('Connected to MongoDB'))
// .catch((err) => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// const http = require('http');
// const express = require("express");
// const bodyParser = require('body-parser');
// const MessagingResponse = require('twilio').twiml.MessagingResponse;
// const { sendSMS } = require("./send.js"); 
// const { default: axios } = require('axios');

// const app = express();
// const PORT = 3000;

// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// app.post('/sms', async (req, res) => {
//     const vendorMessage = req.body.Body; 
//     const from = req.body.From; 
//     const to = req.body.To; 

//     console.log(`Message received from ${from}: ${vendorMessage} : ${to}`);

//     const input = `Message received from ${from}: ${vendorMessage} : ${to}`;

//     try {
//         const response = await axios.post("http://127.0.0.1:5000/negotiate", { input, from });
//         const twiml = new MessagingResponse();
//         twiml.message('The Robots are coming!'); 
//         twiml.message(response.data.response); 
//         res.writeHead(200, { 'Content-Type': 'text/xml' });
//         res.end(twiml.toString());
//     } catch (error) {
//         console.error("Error negotiating:", error.message);
//         const twiml = new MessagingResponse();
//         twiml.message("An error occurred. Please try again later.");
//         res.writeHead(200, { 'Content-Type': 'text/xml' });
//         res.end(twiml.toString());
//     }
// });

// app.get("/", (req, res) => {
//     res.send("Server is running");
// });

// const vendors = [
//     "whatsapp:+917999505967",
// ];
// const message = "I am looking to purchase raw materials to manufacture 100 sofas. My requirements include: Wood/plywood for frames Foam for cushions Upholstery (fabric or leather) Springs, nails, and other accessories My budget is ₹30,000. Please provide your price quote";

// (async () => {
//     for (const vendor of vendors) {
//         try {
//             await sendSMS(message, vendor);
//             console.log(`Message sent to ${vendor}`);
//             const response = await axios.post("http://127.0.0.1:5000/sendMsgFromShopkeeper", { input: message, to: vendor });
//             console.log(`Message pushed to Flask server: ${response.data}`);
//         } catch (error) {
//             console.log(`Error sending SMS to ${vendor}:`, error.message);
//         }
//     }
// })();

// http.createServer(app).listen(1337, () => {
//     console.log(`Twilio webhook server running on port 1337`);
// });

// app.listen(PORT, () => {
//     console.log(`Express server running on port ${PORT}`);
// });




// const http = require('http');
// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const TestRouter = require("./routes/test.router");
// const LoginRouter = require("./routes/login.route");
// const SignupRouter = require("./routes/signup.route");
// const LogoutRouter = require("./routes/logout.route");
// const NewProductRouter = require("./routes/new_product.route");
// // const AddPostRouter = require("./routes/AddPost.routes");
// // const GetPostRouter = require("./routes/GetPost.route");
// const cookieParser = require("cookie-parser");

// const app = express();
// const PORT = 3000;

// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// // Routes
// app.use("/api/test", TestRouter);
// app.use("/api/login", LoginRouter);
// app.use("/api/signup", SignupRouter);
// app.use("/api/logout", LogoutRouter);
// app.use("/api/product/create",NewProductRouter)
// // app.use("/api/posts", AddPostRouter);
// // app.use("/api/posts", GetPostRouter);




// /* Manufacturer */
// app.post('/sms', async (req, res) => {
//     const vendorMessage = req.body.Body; 
//     const from = req.body.From; 
//     const to = req.body.To; 

//     console.log(`Message received from ${from}: ${vendorMessage} : ${to}`);

//     const input = `Message received from ${from}: ${vendorMessage} : ${to}`;

//     try {
//         const response = await axios.post("http://127.0.0.1:5000/negotiate", { input, from });
//         const twiml = new MessagingResponse();
//         // twiml.message('The Robots are coming!'); 
//         twiml.message(response.data.response); 
//         res.writeHead(200, { 'Content-Type': 'text/xml' });
//         res.end(twiml.toString());
//     } catch (error) {
//         console.error("Error negotiating:", error.message);
//         const twiml = new MessagingResponse();
//         twiml.message("An error occurred. Please try again later.");
//         res.writeHead(200, { 'Content-Type': 'text/xml' });
//         res.end(twiml.toString());
//     }
// });

// app.get("/", (req, res) => {
//     res.send("Server is running");
// });

// const vendors = [
//     "whatsapp:+917999505967",
// ];
// const message = "I am looking to purchase raw materials to manufacture 100 sofas. My requirements include: Wood/plywood for frames Foam for cushions Upholstery (fabric or leather) Springs, nails, and other accessories My budget is ₹30,000. Please provide your price quote";

// (async () => {
//     for (const vendor of vendors) {
//         try {
//             await sendSMS(message, vendor);
//             console.log(`Message sent to ${vendor}`);
//             const response = await axios.post("http://127.0.0.1:5000/sendMsgFromShopkeeper", { input: message, to: vendor });
//             console.log(`Message pushed to Flask server: ${response.data}`);
//         } catch (error) {
//             console.log(`Error sending SMS to ${vendor}:`, error.message);
//         }
//     }
// })();

// http.createServer(app).listen(1337, () => {
//     console.log(`Twilio webhook server running on port 1337`);
// });

// app.listen(PORT, () => {
//     console.log(`Express server running on port ${PORT}`);
// });

