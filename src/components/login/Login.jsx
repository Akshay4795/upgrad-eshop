import { React, useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { TextField, Box, Typography } from "@mui/material";
import { useNavigate, NavLink } from "react-router-dom";
import { ToastNotification } from "../../common/services";
import { post_data } from "../../common/fetch";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [notification, setNotification] = useState({
    open: false,
    type: "",
    message: "",
  });

  const signIn = async () => {
    if (
      data.username.trim().length === 0 ||
      data.password.trim().length === 0
    ) {
      //   error_toast("Fill all the details");
      setNotification({
        open: true,
        type: "error",
        message: "Fill all the detail",
      });
      return;
    }
    await post_data("auth/signin", data, {})
      .then((res) => {
        let roles = res.data.roles[0];
        localStorage.setItem("token", "");
        localStorage.setItem("role", roles);

        setNotification({
          open: true,
          type: "success",
          message: "Login Successfully.",
        });
        navigate("/products");
      })
      .catch((e) => {
        setNotification({
          open: true,
          type: "error",
          message: e.response.data.message,
        });
      });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleClose = () => {
    setNotification({ open: false, message: "" });
  };
  return (
    <Box>
      <form className="registerForm">
        <span>
          <LockOutlinedIcon />
        </span>
        <h3 style={{ marginTop: "5px", textAlign: "center" }}>Sign In</h3>
        <TextField
          type="email"
          name="username"
          variant="outlined"
          label="Email Address*"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <TextField
          type="password"
          name="password"
          variant="outlined"
          label="Password*"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <button type="button" onClick={signIn} className="loginBtn">
          SIGN IN
        </button>

        <div
          style={{ display: "flex", justifyContent: "left", marginTop: "30px" }}
        >
          <NavLink to="/signup">
            <Typography variant="body1">
              Don't have an account? Sign Up
            </Typography>
          </NavLink>
        </div>
      </form>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
          width: "100%",
        }}
      >
        <Typography variant="body2">
          Copyright ©
          <a href="https://www.upgrad.com/" target="blank">
            upGrad
          </a>{" "}
          2024.
        </Typography>
      </div>
      <ToastNotification
        open={notification.open}
        type={notification.type}
        message={notification.message}
        handleClose={handleClose}
      />
    </Box>
  );
}
