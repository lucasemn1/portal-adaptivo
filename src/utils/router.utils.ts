export class RouterUtils {
  public static toSearchParams(
    params: Record<string, string | string[] | undefined>,
  ): URLSearchParams {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;

      if (Array.isArray(value)) {
        for (const v of value) {
          searchParams.append(key, v);
        }
      } else {
        searchParams.set(key, value);
      }
    }

    return searchParams;
  }
}
