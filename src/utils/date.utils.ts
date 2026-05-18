import { DateTime } from "luxon";

export class DateUtils {
  public static toBrDateTime(date: Date) {
    return DateTime.fromJSDate(date).toFormat("dd/MM/yyyy, hh:mm:ss");
  }

  public static toBrDate(date: Date) {
    return DateTime.fromJSDate(date).toFormat("dd/MM/yyyy");
  }

  public static toBrTime(date: Date) {
    return DateTime.fromJSDate(date).toFormat("hh:mm:ss");
  }
}
