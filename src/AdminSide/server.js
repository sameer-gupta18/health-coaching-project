const os = require("os");
const express = require("express");
const cors = require("cors");
const whitelistedMac = require("./whitelisted");
const { google } = require("googleapis");
const path = require("path");
// const twilio = require("twilio");
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
// const serviceAccount = require("./dauntlessfooddelivery-54fe0d4108c8.json");
const multer = require("multer");

app.use("/upload", express.static(path.join(__dirname, "upload")));
const upload = multer({ dest: "upload/" });

function getMacAddress() {
  const networkInterfaces = os.networkInterfaces();
  const macAddresses = [];

  for (let key in networkInterfaces) {
    for (let iface of networkInterfaces[key]) {
      if (!iface.internal && iface.mac !== "00:00:00:00:00:00") {
        macAddresses.push(iface.mac.toUpperCase()); // Ensure consistent formatting
      }
    }
  }
  return macAddresses;
}

// Default route for root path
app.get("/", (req, res) => {
  res.send("Server is running! Use /check-mac to verify MAC address.");
});

function checkMacs(computerMac, whiteListedMac) {
  return computerMac.some((element) => whiteListedMac.includes(element));
}

// MAC address verification route
app.get("/check-mac", (req, res) => {
  const systemMACs = getMacAddress();
  const isValidMAC = checkMacs(systemMACs, whitelistedMac);

  if (isValidMAC) {
    res.json({ success: true, message: "ACCESS GRANTED" });
  } else {
    res.status(403).json({ success: false, message: "Access Denied" });
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  const fileURL = `${req.protocol}://${req.get("host")}/upload/${
    file.filename
  }`;
  res.status(200).json({ url: fileURL });
});

// const auth = new google.auth.JWT({
//   email: serviceAccount.client_email,
//   key: serviceAccount.private_key,
//   scopes: ["https://www.googleapis.com/auth/calendar"],
//   subject: "gamingwithsam0@gmail.com",
// });
// // auth.authorize();
// const calender = google.calendar({ version: "v3", auth });

// app.post("/add-to-google-calender", async (req, res) => {
//   const { eventDetails } = req.body;
//   const event = {
//     summary: eventDetails.name,
//     location: eventDetails.location,
//     description: eventDetails.description,
//     start: {
//       dateTime: eventDetails.startDateTime, // e.g., '2024-12-20T09:00:00-07:00'
//       timeZone: "Asia/Kolkata",
//     },
//     end: {
//       dateTime: eventDetails.endDateTime, // e.g., '2024-12-20T10:00:00-07:00'
//       timeZone: "Asia/Kolkata",
//     },
//     attendees: [
//       { email: eventDetails.attendeeEmail },
//       { email: eventDetails.presenterEmail },
//     ],
//   };
//   try {
//     const response = await calender.events.insert({
//       calendarId: "primary",
//       resource: event,
//     });
//     res.status(200).send(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error Creating Event");
//   }
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(getMacAddress());
});
