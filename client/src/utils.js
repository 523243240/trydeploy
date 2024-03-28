/**
 * Returns the string representation of the inputted date.
 * @param {Date} date date to be displayed.
 */
export function getDateString(date) {
    let now = new Date();
    let str = "";
    //Check if the date is the same year as current year
    if (now.getFullYear() === date.getFullYear()) { //Same year
      if (now.getMonth() === date.getMonth() && now.getDate() === date.getDate()) { //Same date
        let diff = (now - date) / 1000; //Get time difference in seconds
        if (diff >= 3600) { //More than an hour
          let hours = Math.floor(diff / 3600);
          str =  hours + ((hours === 1) ? " hour ago" : " hours ago");
        }
        else if (diff >= 60) { //More than a minute
          let mins = Math.floor(diff / 60);
          str =  mins + ((mins === 1) ? " minute ago" : " minutes ago");
        }
        else {
          diff = Math.floor(diff);
          str = diff + ((diff === 1) ? " second ago" : " seconds ago");
        }
      }
      else
        str = date.toLocaleString('default', { hourCycle:"h24", month: "short", day: "numeric", hour: "2-digit", minute:"2-digit"});
    }
    else {
      str =  date.toLocaleString('default', { hourCycle:"h24", month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute:"2-digit"});
    }
    return str;
  }