import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setRole }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("admin");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable scrolling
    return () => {
      document.body.style.overflow = "auto"; // Re-enable scrolling when leaving the page
    };
  }, []);

  const handleLogin = () => {
    if (username && password) {
      setRole(userRole);
      navigate(userRole === "admin" ? "/admin/dashboard" : "/chef/dashboard");
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🔑 Staff Login</h1>
        <label>Select Role:</label>
        <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="chef">Chef</option>
        </select>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>🔓 Login</button>
      </div>
    </div>
  );
};

export default Login;
