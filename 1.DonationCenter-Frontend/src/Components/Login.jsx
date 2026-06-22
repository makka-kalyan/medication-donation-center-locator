import "./Login.css";
import axios from "axios";
import { API_BASE_URL } from "./Service/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/login/`,
        data
      );

      if (res.data.error === "Account not approved yet") {
        setMsgType("error");
        setMessage("Awaiting Admin approval");
        return;
      }

      if (res.data.role === "admin") {
        localStorage.setItem("isUserLoggedIn", "true");
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("role", "admin");
        navigate("/admin");
        return;
      }

      if (res.data.role === "user") {
        localStorage.setItem("isUserLoggedIn", "true");
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("role", "user");
        navigate("/user");
        return;
      }

      setMsgType("error");
      setMessage("Invalid Credentials");

    } catch (err) {
      setMsgType("error");
      setMessage("Invalid username or password");
    }
  };

  return (
    <>
      <main>
        <h2>Login</h2>

        {message && (
          <p className={`msg ${msgType}`} style={{ textAlign: "center" }}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              name="username"
              type="text"
              autoFocus
              placeholder="Enter Username"
              onChange={(e) =>
                setData({ ...data, username: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label>Password:</label>
            <input
              name="password"
              placeholder="Enter Password"
              type="password"
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" id="log-btn">
            Submit
          </button>
        </form>
      </main>

      <footer>
        <h4>&copy; 2025 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};

export default Login;
