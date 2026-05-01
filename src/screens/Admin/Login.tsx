import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/admin/dashboard");
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/admin/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] main-app noise">
      <div className="w-full max-w-md p-10 space-y-10 bg-[#171717]/80 border border-white/5 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tighter text-[#C5C5C5]">AS.DEV</h1>
          <p className="mt-4 text-[10px] text-[#919191] tracking-[0.4em] uppercase font-medium">Restricted Access</p>
        </div>

        <form className="space-y-8" onSubmit={handleLogin}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-medium text-[#919191] uppercase tracking-widest ml-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 text-[#C5C5C5] bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 focus:border-[#C5C5C5]/20 transition-all duration-300 outline-none placeholder:text-gray-700"
                placeholder="admin@as.dev"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-medium text-[#919191] uppercase tracking-widest ml-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 text-[#C5C5C5] bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 focus:border-[#C5C5C5]/20 transition-all duration-300 outline-none placeholder:text-gray-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center">{error}</div>}

          <div>
            <Button
              variant="outline"
              size="lg"
              className="w-full py-5 text-black bg-[#C5C5C5] border-transparent hover:bg-white hover:shadow-[0_0_30px_rgba(197,197,197,0.2)] transition-all duration-500 font-bold tracking-widest text-xs"
              disabled={loading}
            >
              {loading ? "AUTHENTICATING..." : "LOGIN TO DASHBOARD"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
