import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import {
  loginSchema,
  type LoginFormValues,
} from "../schemas/login.schema";

import { useAuth } from "../hooks/useAuth";
import { PATHS } from "@/app/router/paths";

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const data = await login(values);

      console.log("Login Success");

      if (data?.user) {
        navigate(PATHS.DASHBOARD);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <input
        {...register("email")}
        placeholder="Email"
        className="w-full rounded border p-3"
      />

      <p className="text-red-500">
        {errors.email?.message}
      </p>

      <input
        {...register("password")}
        type="password"
        placeholder="Password"
        className="w-full rounded border p-3"
      />

      <p className="text-red-500">
        {errors.password?.message}
      </p>

      <button
        disabled={isLoading}
        className="w-full rounded bg-blue-600 p-3 text-white cursor-pointer font-semibold shadow-md transition hover:bg-blue-700 disabled:bg-blue-400"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <p className="text-xs text-center text-slate-500 font-semibold mb-3">
          DEMO QUICK LOGIN PROFILES
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setValue("email", "master@mill.com");
              setValue("password", "Admin@123");
            }}
            className="text-[10px] bg-slate-50 hover:bg-slate-100 transition text-slate-700 py-2 px-1 rounded text-center font-bold border border-slate-200 shadow-sm cursor-pointer"
          >
            👑 Super Admin
          </button>
          <button
            type="button"
            onClick={() => {
              setValue("email", "admin@mill.com");
              setValue("password", "Admin@123");
            }}
            className="text-[10px] bg-slate-50 hover:bg-slate-100 transition text-slate-700 py-2 px-1 rounded text-center font-bold border border-slate-200 shadow-sm cursor-pointer"
          >
            💼 Party Admin
          </button>
          <button
            type="button"
            onClick={() => {
              setValue("email", "partner@mill.com");
              setValue("password", "Admin@123");
            }}
            className="text-[10px] bg-slate-50 hover:bg-slate-100 transition text-slate-700 py-2 px-1 rounded text-center font-bold border border-slate-200 shadow-sm cursor-pointer"
          >
            🤝 Partner
          </button>
        </div>
      </div>
    </form>
  );
}