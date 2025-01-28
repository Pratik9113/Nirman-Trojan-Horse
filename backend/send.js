require("dotenv").config();

const client = require("twilio")("AC4855640c173befec91743e744db4d5d1","2sGZ9VYQf4uY4CgGjZX04r9wlEC_7ohDF4M2K6qkoRjexaoyX");

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