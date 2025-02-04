const os = require("os");
const express = require("express");
const cors = require("cors");
const whitelistedMac = require("./whitelisted");
const path = require("path");
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(getMacAddress());
});
