// const express = require("express");
// const cors = require("cors");
// const twilio = require("twilio");

// const app = express();
// const PORT = 3001;

// app.use(cors());
// app.use(express.json());

// // Twilio Credentials
// const accountSid = "AC6af7ca6590520b4758c5c83bea75a09f"; // Replace with your Account SID
// const authToken = "583274a3492cee1aa3a6c4a88b1db960"; // Replace with your Auth Token
// const twilioPhoneNumber = "+919971677663"; // Replace with your Twilio phone number

// const client = new twilio(accountSid, authToken);

// // Endpoint to send SMS
// app.post("/send-sms", (req, res) => {
//   const { phoneNumber, name } = req.body;

//   client.messages
//     .create({
//       body: `Hello ${name}, your consultation has been confirmed. Thank you!`,
//       from: twilioPhoneNumber,
//       to: phoneNumber,
//     })
//     .then((message) => {
//       console.log("SMS Sent: ", message.sid);
//       res.json({ success: true, message: "SMS sent successfully" });
//     })
//     .catch((error) => {
//       console.error("Error sending SMS: ", error);
//       res.status(500).json({ success: false, message: "Failed to send SMS" });
//     });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
