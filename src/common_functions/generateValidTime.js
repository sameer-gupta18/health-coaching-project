let interval = 60;
let start_hour = 10;
let end_hour = 21;
let times = [];
for (let hour = start_hour; hour < end_hour; hour++) {
  for (let minute = 0; minute < 60; minute += interval) {
    let time =
      hour < 10
        ? minute < 10
          ? `0${hour}:0${minute}`
          : `0${hour}:${minute}`
        : minute < 10
        ? `${hour}:0${minute}`
        : `${hour}:${minute}`;
    times.push(time);
  }
}
export default times;
