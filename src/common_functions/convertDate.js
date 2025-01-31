let convertDate = (date, form) => {
  //form 1 is 09/12/2024 | 22:51 and form two is 2025-05-05
  let day, year, month, day_suffix;
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  if (form === 1) {
    day = date[0] + date[1];

    month = months[parseInt(date[3] + date[4]) - 1];
    year = date[6] + date[7] + date[8] + date[9];
  } else {
    year = date[0] + date[1] + date[2] + date[3];
    month = months[parseInt(date[5] + date[6]) - 1];
    day = date[8] + date[9];
  }
  if (day[0] !== "1") {
    if (day[1] === "1") {
      day_suffix = "st";
    } else if (day[1] === "2") {
      day_suffix = "nd";
    } else if (day[1] === "3") {
      day_suffix = "rd";
    } else {
      day_suffix = "th";
    }
  } else {
    day_suffix = "th";
  }
  return `${day[0] === "0" ? day[1] : day}${day_suffix} ${month}, ${year}`;
};

export default convertDate;
