import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { produce } from "immer";
import { create } from "zustand";

import { removeToken, setToken } from "@/lib/cookies";
import { User, withToken } from "@/types/entities/user";

type AuthStoreType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isNewNotif: boolean;
  login: (user: User & withToken) => void;
  logout: () => void;
  stopLoading: () => void;
  setIsNotif: (status: boolean) => void;
  setChangedUser: (user: User) => void;
};

const useAuthStoreBase = create<AuthStoreType>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isNewNotif: false,
  login: (user) => {
    setToken(user.token);
    set(
      produce<AuthStoreType>((state) => {
        state.isAuthenticated = true;
        state.user = user;
      })
    );
  },
  logout: () => {
    removeToken();
    set(
      produce<AuthStoreType>((state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
    );
  },
  stopLoading: () => {
    set(
      produce<AuthStoreType>((state) => {
        state.isLoading = false;
      })
    );
  },
  setIsNotif: (status: boolean) => {
    set(
      produce<AuthStoreType>((state) => {
        state.isNewNotif = status;
      })
    );
  },
  setChangedUser: (user: User) => {
    set(
      produce<AuthStoreType>((state) => {
        state.user = user;
      })
    )
  }
}));

const useAuthStore = createSelectorHooks(useAuthStoreBase);

export default useAuthStore;
