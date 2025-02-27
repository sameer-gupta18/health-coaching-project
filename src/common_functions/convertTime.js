let convertTime = (time) => {           //converts 24hr clock into 12 hr clock, which is more readable
  let hours = parseInt(time[0]) * 10 + parseInt(time[1]);
  let suffix = "";
  if (hours < 12) {
    suffix = "AM";
  } else {
    suffix = "PM";
  }
  let minutes = parseInt(time[3]) * 10 + parseInt(time[4]);

  return `${hours < 13 ? hours : hours - 12}:${
    minutes < 10 ? `0${minutes}` : minutes
  } ${suffix}`;
};
export default convertTime;
