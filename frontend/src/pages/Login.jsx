import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     console.log("Login form:", form); // <--- vérifier ici
    try {
      const data = await login(form);

      // Stocker token et rôle
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      // Redirection selon le rôle
    if (data.user.role.toLowerCase() === "admin") {
  window.location.href = "/dashboard";
} else {
  window.location.href = "/home";
}
    } catch (err) {
      setMsg(err.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 mb-4 w-full rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 mb-4 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded w-full"
        >
          Login
        </button>
        {msg && <p className="mt-4 text-red-500">{msg}</p>}
      </form>
    </div>
  );
}
