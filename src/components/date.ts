import Helper from "./helper";

const DateHelper = {
  Minute_Between_Two_Date: (fromDate: Date | number, toDate: Date | number): number => {
    const startDate = new Date(fromDate) as unknown as number
    const endDate = new Date(toDate) as unknown as number;
    const timeDifference = endDate - startDate;
    const minutesDifference = Math.round(timeDifference / (1000 * 60));
    return minutesDifference;
  },

  Last_Months: (numberOfmonth: number, toDate?: number) => {
    let to;
    if (toDate) {
      to = new Date(toDate);
    } else {
      to = new Date();
    }
    const from = new Date(to);
    from.setMonth(from.getMonth() - numberOfmonth);
    const date = Helper.Date(from, to)
    return date
  }
};

export default DateHelper;
