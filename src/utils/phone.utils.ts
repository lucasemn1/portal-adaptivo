import { NumberUtils } from "./number.utils";

export class PhoneUtils {
  public static toPhone(value: string | number) {
    const numbers = String(value).replace(/\D/g, "");

    if (numbers.length <= 2) return numbers;

    const formatted = `(${numbers.slice(0, 2)}) `;

    if (numbers.length <= 6) {
      return formatted + numbers.slice(2);
    }

    if (numbers.length === 11) {
      return formatted + numbers.slice(2, 7) + "-" + numbers.slice(7, 11);
    }

    return formatted + numbers.slice(2, 6) + "-" + numbers.slice(6, 10);
  }

  public static isPhone(value: string) {
    const phoneRegex = /^\(?[1-9]{2}\)?\s?(?:9\d|[2-9])\d{3}-?\d{4}$/;
    return phoneRegex.test(value);
  }

  public static toNumber(value: string) {
    return NumberUtils.getOnlyNumbers(value);
  }
}
