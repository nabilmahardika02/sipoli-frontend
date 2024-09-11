import Cookies from "universal-cookie";

const cookies = new Cookies();

export const getToken = (): string => {
  return cookies.get("@app/token");
};

export const setToken = (token: string) => {
  cookies.set("@app/token", token, {
    path: "/",
  });
};

export const removeToken = () => {
  cookies.remove("@app/token", {
    path: "/",
  });
};
