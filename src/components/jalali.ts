import moment from 'jalali-moment';

const formatDate_ = (date: any): string => {
  return moment(date).locale('fa').format('YYYY-MM-DD HH:mm:ss');
};

const formatDate = (date: any): string => {
  return moment(date).locale('fa').format('YYYY-MM-DD');
};

const formatDate_2 = (date: any): string => {
  return moment(date).locale('fa').format('DD-MM-YYYY');
};

const formatDate_miladi = (date: any): string => {
  return moment.from(date, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
};

const change_day = (date: any): string => {
  return moment(date).date(1).format('YYYY-MM-DD');
};

const change_month = (date: any): string => {
  return moment(date).add(1, 'month').format('YYYY-MM-DD');
};

const get_year_month = (date: any) => {
  const year = moment(date).locale('fa').format('YY');
  const month = moment(date).locale('fa').format('MM');
  const obj = {
    year,
    month
  };
  return obj;
};

const get_fullYear_month = (date: any) => {
  const year = moment(date).locale('fa').format('YYYY');
  const month = moment(date).locale('fa').format('MM');
  const monthName = moment(date).locale('fa').format('MMMM');
  const day = moment(date).locale('fa').format('DD');
  const obj = {
    year,
    month,
    monthName,
    day
  };
  return obj;
};

const day_of_month = (): { is_lastDay: YesNo_; currentDay: number; lastDay: number } => {
  const currentDate = moment();
  const currentDay = currentDate.jDate();
  const currentMonth = currentDate.jMonth() + 1; // Adding 1 because months are zero-based
  const currentYear = currentDate.jYear();

  const lastDay = currentDate.jDaysInMonth();
  if (lastDay === currentDay) {
    return { is_lastDay: 'yes', currentDay: currentDay, lastDay: lastDay };
  } else {
    return { is_lastDay: 'no', currentDay: currentDay, lastDay: lastDay };
  }
};

const monthly_range = (number_of_recent_months: number) => {
  try {
    const myArray = [];
    const currentTime = new Date();
    for (let i = 0; i <= number_of_recent_months; i++) {
      const firstDay = moment(currentTime)
        .locale('fa')
        .subtract(i, 'jMonth')
        .date(1)
        .hour(0)
        .minute(0)
        .second(0)
        .format('YYYY-MM-DD HH:mm:ss');
      const lastDay = moment(currentTime)
        .locale('fa')
        .subtract(i, 'jMonth')
        .endOf('jMonth')
        .hour(23)
        .minute(59)
        .second(59)
        .format('YYYY-MM-DD HH:mm:ss');
      const shamsiMonthName = moment(currentTime).locale('fa').subtract(i, 'jMonth').format('jMMMM');
      const shamsiYear = moment(currentTime).locale('fa').subtract(i, 'jMonth').format('YYYY');
      const shamsiMonth = moment(currentTime).locale('fa').subtract(i, 'jMonth').format('MM');
      const shamsiDay = moment(currentTime).locale('fa').subtract(i, 'jMonth').format('DD');
      const firstDay_gregorianDate = moment.from(firstDay, 'fa', 'YYYY-MM-DD').locale('en');
      const lastDay_gregorianDate = moment.from(lastDay, 'fa', 'YYYY-MM-DD').locale('en');
      const firstDay_unixTimestamp = firstDay_gregorianDate.unix() * 1000;
      const lastDay_unixTimestamp = lastDay_gregorianDate.unix() * 1000;

      const myObj = {
        shamsi: { year: shamsiYear, month: shamsiMonth, day: shamsiDay, month_name: shamsiMonthName },
        firstDay: { shamsi_date: firstDay, gregorian_date: firstDay_gregorianDate, unix: firstDay_unixTimestamp },
        lastDay: { shamsi_date: lastDay, gregorian_date: lastDay_gregorianDate, unix: lastDay_unixTimestamp }
      };

      myArray.push(myObj);
    }
    return myArray;
  } catch (error) {
    console.log(error);
  }
};

export {
  formatDate_,
  formatDate,
  formatDate_2,
  formatDate_miladi,
  change_day,
  change_month,
  get_year_month,
  get_fullYear_month,
  day_of_month,
  monthly_range
};
