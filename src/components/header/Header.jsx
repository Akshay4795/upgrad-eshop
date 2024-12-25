import { React, useEffect, useState } from "react";
import { logData } from "../../common/fetch";

import "./Header.css";
import {
  AppBar,
  Button,
  Grid2,
  Paper,
  InputBase,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const [isLoggedIn, setLogin] = useState(false);
  const navigator = useNavigate();
  const [timeOut, setTimout] = useState(false);
  const location = useLocation();

  const debounce = (e) => {
    if (timeOut) {
      clearTimeout(timeOut);
    }
    setTimout(
      setTimeout(function () {
        if (e.target.value.trim().length > 0) {
          navigator("/products/" + e.target.value);
        } else {
          navigator("/products");
        }
      }, 300)
    );
  };
  useEffect(() => {
    if (logData()) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, [location]);

  const logout = () => {
    localStorage.clear();
    navigator("/login");
  };
  return (
    <AppBar position="static" className="header">
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 6, md: 4 }} className="header-logo">
          <ShoppingCartIcon style={{ color: "white" }}></ShoppingCartIcon>
          <span className="app-name">upGrad E-Shop</span>
        </Grid2>
        <Grid2 size={{ xs: 6, md: 4 }}>
          {isLoggedIn ? (
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 400,
                "background-color": "#5c6bc0",
                height: "30px",
              }}
            >
              <IconButton
                type="button"
                sx={{ p: "10px", color: "white" }}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1, color: "white" }}
                placeholder="Search..."
                inputProps={{ "aria-label": "Search..." }}
                onInput={(e) => {
                  debounce(e);
                }}
              />
            </Paper>
          ) : (
            ""
          )}
        </Grid2>
        <Grid2 size={{ xs: 6, md: 4 }} className="header-buttons">
          {isLoggedIn && (
            <>
              <NavLink to="products" className="header-home header-link">
                Home
              </NavLink>
              {logData()?.role === "ADMIN" && (
                <>
                  <NavLink to="addproduct" className="header-home header-link">
                    Add Product
                  </NavLink>
                </>
              )}
              <Button
                variant="contained"
                onClick={logout}
                className="logout-button"
              >
                LOGOUT
              </Button>
            </>
          )}
          {!isLoggedIn && (
            <>
              <NavLink to="/login" className="header-link">
                Login
              </NavLink>
              <NavLink to="/signup" className="header-link">
                Sign Up
              </NavLink>
            </>
          )}
        </Grid2>
      </Grid2>
    </AppBar>
  );
}
