// let axios = require("axios");

// let generateUsedTimes = async () => {
//   let consultations;
//   await axios.get("http://localhost:3001/consultations").then((res) => {
//     consultations = res.data;
//   });
//   let used_times = [];
//   consultations.map((consultation) =>
//     used_times.push({
//       used_date: consultation.apt_date,
//       used_time: consultation.apt_time,
//     })
//   );
//   return used_times;
// };

// module.exports = generateUsedTimes();
