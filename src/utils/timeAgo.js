export default function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const secondsPast = (now.getTime() - date.getTime()) / 1000;

    if(secondsPast < 60){
        return parseInt(secondsPast) + 's';
    }
    if(secondsPast < 3600){
        return parseInt(secondsPast/60) + 'm';
    }
    if(secondsPast <= 86400){
        return parseInt(secondsPast/3600) + 'h';
    }
    if(secondsPast > 86400){
        const day = parseInt(secondsPast/86400);
        if(day > 31){
          const month = parseInt(day/31);
          if(month > 12){
            const year = parseInt(month/12);
            return year + 'y';
          } else {
            return month + 'mo';
          }
        } else {
          return day + 'd';
        }
    }
}