export const CreatedAtFormatTime = (date) => {
    // Create a Date object from the string
    const dateObject = new Date(date);
  
    // Extract date using toLocaleDateString
    const hour = dateObject.getHours();
    const minuts = dateObject.getMinutes();
    const second = dateObject.getSeconds();

    var formattedTime =(hour < 10?0:'') +hour + ':' + (minuts < 10?0:'') +minuts + ':'+(second < 10?0:'') + second ;


    return formattedTime;
  };
  