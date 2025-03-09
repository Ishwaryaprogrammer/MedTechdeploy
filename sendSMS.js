const twilio = require('twilio');

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Function to send SMS
function sendSMS(phoneNumber, meetLink) {
    return client.messages.create({
        body: `Your Google Meet link: ${meetLink}`,
        from:  process.env.TWILIO_PHONE_NUMBER,  // Your Twilio phone number
        to: phoneNumber,
    });
}

module.exports = { sendSMS };
