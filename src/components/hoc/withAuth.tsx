import { useRouter } from "next/router";
import * as React from "react";

import { getToken, removeToken } from "@/lib/cookies";
import sendRequest from "@/lib/getApi";
import useAuthStore from "@/store/useAuthStore";
import { User } from "@/types/entities/user";
import Loading from "../elements/Loading";
import { DANGER_TOAST, showToast } from "../elements/Toast";
import Forbidden from "../fragments/Forbidden";

export interface WithAuthProps {
  user: User;
}

export const USER_ROUTE = "/home";
export const OPERATOR_ROUTE = "/home";
export const DOKTER_ROUTE = "/home";
export const PERAWAT_ROUTE = "/home";
export const PASIEN_ROUTE = "/home";
export const LOGIN_ROUTE = "/login";

export enum RouteRole {
  public,
  user,
  OPERATOR,
  DOKTER,
  PERAWAT,
  PASIEN,
}

export default function withAuth<T>(
  Component: React.ComponentType<T>,
  routeRole: keyof typeof RouteRole
) {
  const ComponentWithAuth = (props: Omit<T, keyof WithAuthProps>) => {
    const router = useRouter();
    const { query } = router;

    //*=========== STORE ===========
    const isAuthenticated = useAuthStore.useIsAuthenticated();
    const isLoading = useAuthStore.useIsLoading();
    const login = useAuthStore.useLogin();
    const logout = useAuthStore.useLogout();
    const stopLoading = useAuthStore.useStopLoading();
    const user = useAuthStore.useUser();
    const token = getToken();

    const checkAuth = React.useCallback(() => {
      if (!token) {
        if (isAuthenticated) {
          logout();
        }
        stopLoading();
        return;
      }
      const loadUser = async () => {
        try {
          const [data, message, isSuccess] = await sendRequest(
            "get",
            user ? "/profile/me?profileId=" + user?.profileId : "/profile/me"
          );

          if (!isSuccess) {
            showToast("Sesi login tidak valid", DANGER_TOAST);
            throw new Error("Sesi login tidak valid");
          }

          login({
            token: token,
            ...(data as User),
          });
        } catch (err) {
          logout();
          removeToken();
        } finally {
          stopLoading();
        }
      };

      if (!isAuthenticated) {
        loadUser();
      }
    }, [isAuthenticated, login, logout, stopLoading, token, user]);

    const Redirect = React.useCallback(() => {
      if (isAuthenticated) {
        if (routeRole === "public") {
          if (query?.redirect) {
            router.replace(query.redirect as string);
          } else {
            switch (user?.role) {
              case "OPERATOR":
                router.push(OPERATOR_ROUTE);
                break;
              case "DOKTER":
                router.push(DOKTER_ROUTE);
                break;
              case "PERAWAT":
                router.push(PERAWAT_ROUTE);
                break;
              case "PASIEN":
                router.push(PASIEN_ROUTE);
                break;
              default:
                router.push(USER_ROUTE);
                break;
            }
          }
        }
      } else if (routeRole !== "public") {
        router.push(LOGIN_ROUTE);
      }
    }, [isAuthenticated, query?.redirect, user?.role, router]);

    React.useEffect(() => {
      checkAuth();

      window.addEventListener("focus", checkAuth);
      return () => {
        window.removeEventListener("focus", checkAuth);
      };
    }, [checkAuth]);

    React.useEffect(() => {
      const handleAuthCheck = async () => {
        if (!isAuthenticated || !token) {
          await checkAuth();
        }

        if (!isLoading) {
          Redirect();
        }
      };

      handleAuthCheck();
    }, [isAuthenticated, isLoading, checkAuth, token, Redirect]);

    if (isLoading) {
      return (
        <div className="w-full flex justify-center items-center h-screen">
          <Loading size="lg" />
        </div>
      );
    }

    // unauthenticated user trying to access the system
    if ((isLoading || !isAuthenticated) && routeRole !== "public") {
      return (
        <div className="w-full flex justify-center items-center h-screen">
          <Loading size="lg" />
        </div>
      );
    }

    // trying to access a route that is not authorized
    if (isAuthenticated) {
      if (routeRole === "OPERATOR" && user?.role !== "OPERATOR") {
        return <Forbidden />;
      }
      if (routeRole === "DOKTER" && user?.role !== "DOKTER") {
        return <Forbidden />;
      }
      if (routeRole === "PERAWAT" && user?.role !== "PERAWAT") {
        return <Forbidden />;
      }
      if (routeRole === "PASIEN" && user?.role !== "PASIEN") {
        return <Forbidden />;
      }
    }

    return <Component {...(props as T)} user={user} />;
  };

  return ComponentWithAuth;
}
