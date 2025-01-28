const http = require('http');
const express = require("express");
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const { sendSMS } = require("./send.js"); 
const { default: axios } = require('axios');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', async (req, res) => {
    const vendorMessage = req.body.Body; 
    const from = req.body.From; 
    const to = req.body.To; 

    console.log(`Message received from ${from}: ${vendorMessage} : ${to}`);

    const input = `Message received from ${from}: ${vendorMessage} : ${to}`;

    try {
        const response = await axios.post("http://127.0.0.1:5000/negotiate", { input, from });
        const twiml = new MessagingResponse();
        twiml.message('The Robots are coming!'); 
        twiml.message(response.data.response); 
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    } catch (error) {
        console.error("Error negotiating:", error.message);
        const twiml = new MessagingResponse();
        twiml.message("An error occurred. Please try again later.");
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    }
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

const vendors = [
    "whatsapp:+917999505967",
    "whatsapp:+919082015463"
];
const message = "I am looking to purchase raw materials to manufacture 100 sofas. My requirements include: Wood/plywood for frames Foam for cushions Upholstery (fabric or leather) Springs, nails, and other accessories My budget is ₹30,000. Please provide your price quote";

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

http.createServer(app).listen(1337, () => {
    console.log(`Twilio webhook server running on port 1337`);
});

app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
});
