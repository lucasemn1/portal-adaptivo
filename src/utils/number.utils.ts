export class NumberUtils {
  public static toBRNumber(value: number) {
    return Intl.NumberFormat("pt-BR").format(value);
  }

  public static getOnlyNumbers(value: string) {
    return Number(value.replace(/\D/g, ""));
  }
}
