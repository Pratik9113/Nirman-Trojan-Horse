require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

const client = require("twilio")("AC4855640c173befec91743e744db4d5d1","6aab26eb628fa4211721d62a37e98d17");

const sendSMS = async(body, recipient) => {
    let msgOptions = {
        from : "whatsapp:+14155238886",
        body : body,
        to : recipient,
    };
    try {
        const message = await client.messages.create(msgOptions);
        console.log(message);
    } catch (error) {
        console.log(error)
    }
}

module.exports = {sendSMS}