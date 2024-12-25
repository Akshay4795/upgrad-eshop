import { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import React from "react";
import { ToastNotification } from "../../common/services";
import { TextField, Typography } from "@mui/material";
import { useNavigate, NavLink } from "react-router-dom";
import { post_data } from "../../common/fetch";

export default function Signup() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    open: false,
    type: "",
    message: "",
  });

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
    roles: "user",
    contactNumber: "",
  });
  const signup = async () => {
    if (
      data.firstName.trim().length === 0 ||
      data.lastName.trim().length === 0 ||
      data.email.trim().length === 0 ||
      data.password.trim().length === 0 ||
      data.confirm_password.trim().length === 0 ||
      data.contactNumber.trim().length === 0
    ) {
      //error_toast("Fill all the details");
      setNotification({
        open: true,
        type: "error",
        message: "Fill all the detail",
      });
      return;
    }
    if (data.confirm_password !== data.password) {
      //error_toast("Confirm password does not match with password");
      setNotification({
        open: true,
        type: "error",
        message: "Confirm password does not match with password",
      });
      return;
    }
    await post_data("/auth/signup", data, {})
      .then((res) => {
        setNotification({
          open: true,
          type: "success",
          message: res.data.message,
        });
        navigate("/login");
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
    <div>
      <form className="registerForm">
        <span>
          <LockOutlinedIcon />
        </span>
        <h3 style={{ marginTop: "5px", textAlign: "center" }}>Sign up</h3>
        <TextField
          name="firstName"
          label="First Name*"
          variant="outlined"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <TextField
          type="text"
          name="lastName"
          variant="outlined"
          label="Last Name*"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <TextField
          type="email"
          name="email"
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
        <TextField
          type="password"
          name="confirm_password"
          variant="outlined"
          label="Confirm Password*"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <TextField
          type="text"
          name="contactNumber"
          variant="outlined"
          label="Contact Number*"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <button type="button" onClick={signup} className="loginBtn">
          SIGN UP
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            marginTop: "30px",
          }}
        >
          <NavLink to="/login">
            <Typography variant="body1">
              Already have an account? Sign in
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
    </div>
  );
}
