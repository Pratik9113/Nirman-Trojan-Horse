
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import TestRouter from "./routes/test.router.js";
import LoginRouter from "./routes/login.route.js";
import SignupRouter from "./routes/signup.route.js";
import LogoutRouter from "./routes/logout.route.js";
import cookieParser from "cookie-parser";
import AddPostRouter from "./routes/AddPost.routes.js";
import GetPostRouter from "./routes/GetPost.route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Database Connection
connectDB();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/", TestRouter);
app.use("/user/login", LoginRouter);
app.use("/user/signup", SignupRouter);
app.use("/user/logout", LogoutRouter);
app.use("/dashboard", AddPostRouter);
app.use("/dashboard", GetPostRouter);
app.use("/dashboard", GetPostRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// // const http = require('http');
// // const express = require("express");
// // const bodyParser = require('body-parser');
// // const MessagingResponse = require('twilio').twiml.MessagingResponse;
// // const { sendSMS } = require("./send.js"); 
// // const { default: axios } = require('axios');

// // const app = express();
// // const PORT = 3000;

// // app.use(express.json());
// // app.use(bodyParser.urlencoded({ extended: false }));

// // app.post('/sms', async (req, res) => {
// //     const vendorMessage = req.body.Body; 
// //     const from = req.body.From; 
// //     const to = req.body.To; 

// //     console.log(`Message received from ${from}: ${vendorMessage} : ${to}`);

// //     const input = `Message received from ${from}: ${vendorMessage} : ${to}`;

// //     try {
// //         const response = await axios.post("http://127.0.0.1:5000/negotiate", { input, from });
// //         const twiml = new MessagingResponse();
// //         twiml.message('The Robots are coming!'); 
// //         twiml.message(response.data.response); 
// //         res.writeHead(200, { 'Content-Type': 'text/xml' });
// //         res.end(twiml.toString());
// //     } catch (error) {
// //         console.error("Error negotiating:", error.message);
// //         const twiml = new MessagingResponse();
// //         twiml.message("An error occurred. Please try again later.");
// //         res.writeHead(200, { 'Content-Type': 'text/xml' });
// //         res.end(twiml.toString());
// //     }
// // });

// // app.get("/", (req, res) => {
// //     res.send("Server is running");
// // });

// // const vendors = [
// //     "whatsapp:+917999505967",
// // ];
// // const message = "I am looking to purchase raw materials to manufacture 100 sofas. My requirements include: Wood/plywood for frames Foam for cushions Upholstery (fabric or leather) Springs, nails, and other accessories My budget is ₹30,000. Please provide your price quote";

// // (async () => {
// //     for (const vendor of vendors) {
// //         try {
// //             await sendSMS(message, vendor);
// //             console.log(`Message sent to ${vendor}`);
// //             const response = await axios.post("http://127.0.0.1:5000/sendMsgFromShopkeeper", { input: message, to: vendor });
// //             console.log(`Message pushed to Flask server: ${response.data}`);
// //         } catch (error) {
// //             console.log(`Error sending SMS to ${vendor}:`, error.message);
// //         }
// //     }
// // })();

// // http.createServer(app).listen(1337, () => {
// //     console.log(`Twilio webhook server running on port 1337`);
// // });

// // app.listen(PORT, () => {
// //     console.log(`Express server running on port ${PORT}`);
// // });




// const http = require('http');
// const express = require("express");
// const bodyParser = require('body-parser');
// const MessagingResponse = require('twilio').twiml.MessagingResponse;
// const { sendSMS } = require("./send.js"); 
// const { default: axios } = require('axios');
// const manufacturerRoute = require('./routes/manufactorRoute.js');

// const app = express();
// const PORT = 3000;

// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));





// /* Manufacturer */
// app.post("/maker", manufacturerRoute);

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

// // const vendors = [
// //     "whatsapp:+917999505967",
// // ];
// // const message = "I am looking to purchase raw materials to manufacture 100 sofas. My requirements include: Wood/plywood for frames Foam for cushions Upholstery (fabric or leather) Springs, nails, and other accessories My budget is ₹30,000. Please provide your price quote";

// // (async () => {
// //     for (const vendor of vendors) {
// //         try {
// //             await sendSMS(message, vendor);
// //             console.log(`Message sent to ${vendor}`);
// //             const response = await axios.post("http://127.0.0.1:5000/sendMsgFromShopkeeper", { input: message, to: vendor });
// //             console.log(`Message pushed to Flask server: ${response.data}`);
// //         } catch (error) {
// //             console.log(`Error sending SMS to ${vendor}:`, error.message);
// //         }
// //     }
// // })();

// http.createServer(app).listen(1337, () => {
//     console.log(`Twilio webhook server running on port 1337`);
// });

// app.listen(PORT, () => {
//     console.log(`Express server running on port ${PORT}`);
// });

