import { NumberUtils } from "./number.utils";

export class CEPUtils {
  public static toCEP(value: number) {
    const strValue = String(value);

    if (strValue.length > 5) {
      return strValue.slice(0, 5) + "-" + strValue.slice(5, strValue.length);
    }

    return strValue;
  }

  public static isCEP(value: string) {
    return /^[0-9]{5}-?[0-9]{3}$/.test(value);
  }

  public static toNumber(value: string) {
    return NumberUtils.getOnlyNumbers(value);
  }
}
