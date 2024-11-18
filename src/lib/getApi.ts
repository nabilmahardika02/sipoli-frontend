import {
  DANGER_TOAST,
  dismissLoadingToast,
  showLoadingToast,
  showToast,
  SUCCESS_TOAST,
} from "@/components/elements/Toast";
import api from "@/lib/api";
import { ApiResponse } from "@/types/responses/ApiResponse";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken } from "./cookies";

const sendRequest = async <T>(
  httpMethod: string,
  url: string,
  data?: any,
  toast?: boolean,
  isShowLoading?: boolean,
): Promise<[T | "", string, boolean]> => {
  try {
    if (!isShowLoading) {
      showLoadingToast();
    }
    const addAuthorizationHeader = (
      config: AxiosRequestConfig
    ): AxiosRequestConfig => {
      const token = getToken();
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      };
    };

    const apiResponse: AxiosResponse<ApiResponse<T>> = await api(
      addAuthorizationHeader({ method: httpMethod, url, data })
    );

    dismissLoadingToast();
    if (toast) {
      showToast(apiResponse.data.message, SUCCESS_TOAST);
    }
    return [apiResponse.data.result, apiResponse.data.message, true];
  } catch (error) {
    dismissLoadingToast();

    if (error instanceof AxiosError) {
      showToast(error.response?.data.message || "Service unavailable", DANGER_TOAST);
      return ["", error.response?.data.message, false];
    } else {
      showToast("Terjadi kesalahan", DANGER_TOAST);
      return ["", "Terjadi kesalahan", false];
    }
  }
};

export default sendRequest;
