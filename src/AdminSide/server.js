const os = require("os");
const express = require("express");
const cors = require("cors");
const whitelistedMac = require("./whitelisted");
const path = require("path");
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
const multer = require("multer");

app.use("/upload", express.static(path.join(__dirname, "upload")));
const upload = multer({ dest: "upload/" });

function getMacAddress() {
  const networkInterfaces = os.networkInterfaces();         //retrieves system MAC address
  const macAddresses = [];

  for (let key in networkInterfaces) {
    for (let iface of networkInterfaces[key]) {           //stores the MAC adresses in a desired format in macAddresses
      if (!iface.internal && iface.mac !== "00:00:00:00:00:00") {
        macAddresses.push(iface.mac.toUpperCase());
      }
    }
  }
  return macAddresses;
}

app.get("/", (req, res) => {
  res.send("Server is running! Use /check-mac to verify MAC address.");
});

function checkMacs(computerMac, whiteListedMac) {
  return computerMac.some((element) => whiteListedMac.includes(element));           //returns boolean for whether macAddress is in the whitelister MACs
}

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
  const file = req.file;      //access the file parameter from the input

  const fileURL = `${req.protocol}://${req.get("host")}/upload/${
    file.filename
  }`;                         //generate URL for the file
  res.status(200).json({ url: fileURL });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
