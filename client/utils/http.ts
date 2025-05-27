import axios from "axios";
import qs from "qs";

export class AxiosInterceptor {
  //  @ts-expect-error environment variable may be missing
  private static readonly baseURL: string = process.env.NEXT_PUBLIC_BACKEND_URL;

  private static headers: object = {
    "Content-Type": "application/json",
    Accept: "*/*",
    "Access-Control-Allow-Origin": "*",
  };

  public static $get = async (endpoint: string, params: object) => {
    try {
      const { data: body } = await axios.get(this.baseURL + endpoint, {
        params,
        headers: this.headers,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" }); // Use 'repeat' to avoid []
        },
      });
      return body;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("[AXIOS]: ", error.message);
        return error;
      } else {
        console.log("[TS]: ", error);
      }
    }
  };

  public static $post = async (endpoint: string, data: object) => {
    try {
      const { data: body } = await axios.post(this.baseURL + endpoint, data, {
        headers: this.headers,
      });
      return body;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("[AXIOS]: ", error.message);
        return error;
      } else {
        console.log("[TS]: ", error);
      }
    }
  };
}

new AxiosInterceptor();
