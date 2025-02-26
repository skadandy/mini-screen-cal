interface Holiday {
  name: string;
  date: string; // YYYY-MM-DD format
  days?: number; // 假期天数
}

// 2025年节假日安排
export const holidays: Holiday[] = [
  { name: '元旦', date: '2025-01-01', days: 3 },
  { name: '春节', date: '2025-01-28', days: 7 },
  { name: '清明节', date: '2025-04-04', days: 3 },
  { name: '劳动节', date: '2025-05-01', days: 5 },
  { name: '端午节', date: '2025-06-02', days: 3 },
  { name: '中秋节', date: '2025-09-12', days: 3 },
  { name: '国庆节', date: '2025-10-01', days: 7 },
];

export function getNextHoliday(currentDate: Date): { name: string; date: string; daysUntil: number } | null {
  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);

  let nextHoliday = null;
  let minDays = Infinity;

  for (const holiday of holidays) {
    const holidayDate = new Date(holiday.date);
    holidayDate.setHours(0, 0, 0, 0);
    
    const timeDiff = holidayDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff > 0 && daysDiff < minDays) {
      minDays = daysDiff;
      nextHoliday = {
        name: holiday.name,
        date: holiday.date,
        daysUntil: daysDiff
      };
    }
  }

  return nextHoliday;
}
