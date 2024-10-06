import useAuthStore from "@/store/useAuthStore";

export const checkRole = (roles: string[]): boolean => {
  const user = useAuthStore.useUser();
  return user?.role ? roles.includes(user.role) : false;
};
