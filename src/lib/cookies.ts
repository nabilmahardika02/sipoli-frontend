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
