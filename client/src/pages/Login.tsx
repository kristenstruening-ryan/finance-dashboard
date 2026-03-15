import { useState } from "react"; // Changed import
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Login failed. Please check your credentials.",
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/login", {
        email: "guest@example.com",
        password: "password123",
      });
      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError("Guest login currently unavailable.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md p-10 bg-white border shadow-2xl dark:bg-slate-900 rounded-[2.5rem] border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-blue-600 shadow-xl rounded-2xl shadow-blue-500/20">
            <Wallet className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="mb-2 text-3xl font-black tracking-tighter text-center text-slate-900 dark:text-white">
          Welcome Back
        </h2>
        <p className="mb-10 font-medium text-center text-slate-500 dark:text-slate-400">
          Securely manage your assets in one place.
        </p>

        {error && (
          <div className="p-4 mb-8 text-xs font-black tracking-wide duration-300 border text-rose-600 border-rose-100 rounded-2xl bg-rose-50 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 animate-in shake-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-5 py-4 font-bold transition-all border outline-none bg-slate-50 dark:bg-slate-950 rounded-2xl border-slate-200 dark:border-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
              Password
            </label>
            <input
              type="password"
              className="w-full px-5 py-4 font-bold transition-all border outline-none bg-slate-50 dark:bg-slate-950 rounded-2xl border-slate-200 dark:border-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="pt-4 space-y-4">
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex items-center justify-center w-full py-5 text-xs font-black uppercase tracking-[0.2em] text-white transition-all bg-blue-600 shadow-xl shadow-blue-500/20 dark:shadow-none hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] rounded-2xl disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Sign In"
              )}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleGuestLogin}
              className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] transition-all bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-2xl"
            >
              Explore as Guest
            </button>
          </div>
        </form>

        <p className="mt-10 text-[11px] font-bold text-center uppercase tracking-wider text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="ml-1 text-blue-600 transition-colors dark:text-blue-400 hover:underline underline-offset-4"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
