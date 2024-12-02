import Cookies from "universal-cookie";

const cookies = new Cookies();

export const getToken = (): string => {
  return cookies.get("@sipoli/token");
};

export const setToken = (token: string) => {
  cookies.set("@sipoli/token", token, {
    path: "/",
  });
};

export const removeToken = () => {
  cookies.remove("@sipoli/token", {
    path: "/",
  });
};

export const setStartDateCookies = (startDate: string) => {
  cookies.set("@sipoli/startdate", startDate, {
    path: "/",
  });
};

export const getStartDateCookies = (): string => {
  return cookies.get("@sipoli/startdate");
};

export const setEndDateCookies = (endDate: string) => {
  cookies.set("@sipoli/enddate", endDate, {
    path: "/",
  });
};

export const getEndDateCookies = (): string => {
  return cookies.get("@sipoli/enddate");
};
