/** Asia/Tokyo のカレンダー日付を YYYY-MM-DD で返す */
export function toTokyoDateString(date: Date = new Date()): string {
  return date.toLocaleDateString("sv-SE", {
    timeZone: "Asia/Tokyo",
  });
}

/** 初日を含めるので、実際に取得する日数は days + 1 日 */
export function getTokyoDateRangeStrings(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);

  return {
    startDate: toTokyoDateString(date),
    endDate: toTokyoDateString(),
  };
}
