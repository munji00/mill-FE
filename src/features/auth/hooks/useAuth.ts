import { useCallback } from "react";
import { useLoginMutation, useLogoutMutation } from "../api/authApi";
import { tokenManager } from "../lib/tokenManager";
import { useAppDispatch } from "@/app/store/hooks";
import {
  logout as logoutAction,
  setCredentials,
} from "@/app/store/slices/authSlice";
import type { LoginRequest } from "../types/auth.types";

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const [loginMutation, loginState] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();

  const login = useCallback(
  async (payload: LoginRequest) => {
    const response = await loginMutation(payload).unwrap();

    const { accessToken, user } = response.data;

    tokenManager.set(accessToken);

    dispatch(
      setCredentials({
        accessToken,
        user,
      })
    );

    return response.data;
  },
  [dispatch, loginMutation]
);

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } finally {
      tokenManager.clear();
      dispatch(logoutAction());
    }
  }, [dispatch, logoutMutation]);

  return {
    login,
    logout,

    isLoading: loginState.isLoading,
    error: loginState.error,
  };
};