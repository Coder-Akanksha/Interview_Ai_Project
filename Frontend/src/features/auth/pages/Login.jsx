import React from 'react';
import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../Hooks/useAuth.js";

const Login = () => {
  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  if (loading) {
    return (<main><h1>Loading.......</h1></main>);
  }

  return (
    <>
      <main>
        <div className="form-container">
          <h1>Login</h1>

          {error && <p style={{ color: "#ff4d4f", marginBottom: "1rem" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                value={email}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                value={password}
                placeholder="Enter password"
                required
              />
            </div>

            <button className="button primary-button" type="submit">Login</button>
          </form>
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </main>
    </>
  );
};

export default Login;
