/** Asia/Tokyo のカレンダー日付を YYYY-MM-DD で返す（input type="date" / z.iso.date 用） */
export function toTokyoDateString(date: Date = new Date()): string {
  // sv-SE は YYYY-MM-DD を返す
  return date.toLocaleDateString("sv-SE", {
    timeZone: "Asia/Tokyo",
  });
}

/** 画面表示用（例: 2026/8/12） */
export function formatTokyoDateLabel(date: Date = new Date()): string {
  return date.toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });
}

/**
 * 東京の暦日から days 日前までの期間を YYYY-MM-DD で返す。
 * 初日を含めるので、実際に取得する日数は days + 1 日。
 *
 * now を引数に取る理由:
 * startDate と endDate を同じ瞬間から計算し、東京の日付変更をまたいでもずれないようにする
 */
export function getTokyoDateRangeStrings(days: number, now: Date = new Date()) {
  const endDate = toTokyoDateString(now);
  const [year, month, day] = endDate.split("-").map(Number);
  // UTC は夏時間がないので、カレンダー日の加減算がずれない
  const startUtc = new Date(Date.UTC(year, month - 1, day - days));

  return {
    startDate: startUtc.toISOString().slice(0, 10),
    endDate,
  };
}

export function toUtcDateFromIsoDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function toRecordDate(date: {
  year: number;
  month: number;
  day: number;
}) {
  return new Date(Date.UTC(date.year, date.month - 1, date.day));
}
