import axios from "axios";

let access = null;
let message = "";

const verifyMAC = async () => {
  try {
    const response = await axios.get("http://localhost:5000/check-mac");
    if (response.data.success) {
      access = true;
      message = "Access Granted";
    } else {
      access = false;
      message = "You do not have permission to access this webpage";
    }
  } catch (error) {
    access = false;
    message = "ERROR 403";
  }

  return access;
};
export default verifyMAC;
