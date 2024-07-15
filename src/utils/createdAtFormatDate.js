export const CreatedAtFormatDate = (date) => {
    // Create a Date object from the string
    const dateObject = new Date(date);
  
    // Extract date using toLocaleDateString
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth()+1;
    const day = dateObject.getDate();

    var formattedDate =year + '-' + (month < 10 ? '0' : '') + month + '-'+(day < 10 ? '0' : '') + day +'';


    return formattedDate;
  };
  