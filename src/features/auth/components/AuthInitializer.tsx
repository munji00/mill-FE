import { useEffect } from "react";

import { tokenManager } from "../lib/tokenManager";
import { useLazyMeQuery } from "../api/authApi";

import { useAppDispatch } from "@/app/store/hooks";
import { setCredentials } from "@/app/store/slices/authSlice";

export const AuthInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const [getMe] = useLazyMeQuery();

  useEffect(() => {
    const init = async () => {
      const token = tokenManager.get();
      if (!token) return;

      try {
        const response = await getMe().unwrap();
        const user = response.data;
        console.log(user, 'user===>')

        dispatch(
          setCredentials({
            accessToken: token,
            user,
          })
        );
      } catch {
        tokenManager.clear();
      }
    };

    init();
  }, [dispatch, getMe]);

  return <>{children}</>;
};