export const CreatedAtFormatTime = (date) => {
  const dateObject = new Date(date);

  const hour = dateObject.getHours();
  const minuts = dateObject.getMinutes();
  const second = dateObject.getSeconds();

  var formattedTime =
    (hour < 10 ? 0 : "") +
    hour +
    ":" +
    (minuts < 10 ? 0 : "") +
    minuts +
    ":" +
    (second < 10 ? 0 : "") +
    second;

  return formattedTime;
};
