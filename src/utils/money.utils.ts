export class MoneyUtils {
  public static toBRL(value: number) {
    return Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  public static isBrl(value: string) {
    const regexBRL = /^(?:R\$\s?)?\d{1,3}(?:\.\d{3})*,\d{2}$/;
    return regexBRL.test(value);
  }

  public static toNumber(value: string) {
    if (this.isBrl(value)) {
      return Number(
        value
          .replace("R$", "")
          .replace(" ", "")
          .replaceAll(".", "")
          .replace(",", "."),
      );
    }

    return 0;
  }
}
