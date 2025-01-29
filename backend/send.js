require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

const client = require("twilio")(accountSid,authToken);

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

