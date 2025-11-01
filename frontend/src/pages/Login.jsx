import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirection si déjà connecté
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "client") navigate("/client/home");
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const data = await login(form);
      console.log("Login response:", data);

      // Stocker token, rôle et nom
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role.toLowerCase());
      localStorage.setItem("name", data.user.name || data.user.email);

      // Redirection selon rôle
      if (data.user.role.toLowerCase() === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/client/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMsg(err.response?.data?.message || "Erreur de connexion");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
            <span className="text-2xl font-bold text-white">M</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">MarocImmo</h1>
          <p className="text-gray-600 mt-2">Connectez-vous à votre compte</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="exemple@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {msg && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{msg}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          En vous connectant, vous acceptez nos conditions d'utilisation
        </p>
      </div>
    </div>
  );
}
