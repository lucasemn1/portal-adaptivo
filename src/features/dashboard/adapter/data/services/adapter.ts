import axios from "axios";

export class AdapterService {
  public static getConnection() {
    return axios.create({
      baseURL: import.meta.env.VITE_BACKEND_API_BASE_URL,
    });
  }

  public static async submit(_: unknown, formData: FormData) {
    const connection = AdapterService.getConnection();
    const response = await connection.post<{ status: number; data: string }>(
      "/chat/adapt",
      formData,
    );

    return { status: response.data.status, data: response.data.data };
  }
}
