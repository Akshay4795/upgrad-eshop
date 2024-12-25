import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get_details, logData, post_login } from "../../common/fetch";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import {
  Box,
  Button,
  colors,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { ToastNotification } from "../../common/services";
import "./AddAddress.css";
import { LineWeight } from "@mui/icons-material";
const steps = ["Items", "Select Address", "Confirm order"];
export default function AddAddress() {
  const { id, qty } = useParams();
  const navigate = useNavigate();
  const [addressList, setAddressList] = useState([]);
  const [activeKey, setActiveKey] = useState(1);
  const [address, setAddress] = useState("");
  const [finalstep, setFinalStep] = useState(false);
  const [details, setDetails] = useState(null);
  const [data, setData] = useState({
    name: "",
    contactNumber: "",
    street: "",
    city: "",
    state: "",
    landmark: "",
    zipcode: "",
  });
  const [notification, setNotification] = useState({
    open: false,
    type: "",
    message: "",
  });
  const handleClose = () => {
    setNotification({ open: false, message: "" });
  };
  const addAddress = async () => {
    if (
      data.name.trim().length === 0 ||
      data.contactNumber.trim().length === 0 ||
      data.street.trim().length === 0 ||
      data.city.trim().length === 0 ||
      data.state.trim().length === 0 ||
      data.landmark.trim().length === 0 ||
      data.zipcode.trim().length === 0
    ) {
      setNotification({
        open: true,
        type: "error",
        message: "Fill all the details",
      });
      return;
    }
    let decoded = jwtDecode(logData().token);
    data.user = decoded.sub;
    await post_login("addresses", data)
      .then((res) => {
        setNotification({
          open: true,
          type: "success",
          message: "address added successfully",
        });
        getAddresList();
        setData({
          ...data,
          name: "",
          contactNumber: "",
          city: "",
          state: "",
          street: "",
          landmark: "",
          zipcode: "",
        });
      })
      .catch((e) => {
        setNotification({
          open: true,
          type: "error",
          message: "something went wrong",
        });
      });
  };
  const placeOrder = async () => {
    let json = {
      quantity: 2,
      user: address.user,
      product: id,
      address: address.id,
    };

    await post_login("/orders", json)
      .then((res) => {
        navigate("/products", {
          state: {
            open: true,
            type: "success",
            message: "order placed successfully.",
          },
        });
      })
      .catch((e) => {
        setNotification({
          open: true,
          type: "error",
          message: "something went wrong",
        });
      });
  };
  const goToOrder = () => {
    navigate("/product/" + id);
  };
  const getAddresList = async () => {
    await get_details("/addresses")
      .then((res) => {
        let a = res.data;
        a = a.map((e) => {
          let obj = {
            state: e.state,
            city: e.city,
            street: e.street,
            landmark: e.landmark,
            zipcode: e.zipcode,
            contactNumber: e.contactNumber,
            user: e.user,
            id: e.id,
            name: e.name,
          };
          return obj;
        });
        setAddressList(a);
      })
      .catch((e) => {
        setNotification({
          open: true,
          type: "error",
          message: "something  went wrong",
        });
      });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const nextstep = () => {
    if (address === "") {
      setNotification({
        open: true,
        type: "error",
        message: "please select address",
      });
      return;
    }
    setActiveKey(2);
    setFinalStep(true);
    getProductDetails();
  };

  const getProductDetails = async () => {
    await get_details("/products/" + id)
      .then((res) => {
        let a = res.data;
        setDetails(a);
      })
      .catch((e) => {
        setNotification({
          open: true,
          type: "error",
          message: "something  went wrong",
        });
      });
  };

  const midStep = () => {
    navigate("/addaddress/" + id + "/2");
    setActiveKey(1);
    setFinalStep(false);
  };

  useEffect(() => {
    if (!logData()) {
      navigate("/login");
    } else {
      if (addressList.length == 0) getAddresList();
    }
  });
  return (
    <div>
      <Box sx={{ width: "80%", margin: "auto", marginY: "20px" }}>
        <Stepper activeStep={activeKey}>
          {steps.map((label, index) => (
            <Step
              key={label}
              sx={{
                "& .MuiStepLabel-root .Mui-completed": {
                  color: "#3f51b5",
                },
                "& .MuiStepLabel-label.Mui-completed": {
                  color: "black",
                },
                "& .MuiStepLabel-root .Mui-active": {
                  color: "#3f51b5",
                },
                "& .MuiStepLabel-label.Mui-active": {
                  color: "black !important",
                },
              }}
            >
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {!finalstep && (
        <>
          <div style={{ textAlign: "center" }}>
            <p style={{ width: "56%" }}>Select Address:</p>
            <TextField
              size="small"
              name="address"
              id="outlined-select-currency"
              select
              label="Select"
              defaultValue=""
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              style={{ width: "50%", textAlign: "start" }}
            >
              <MenuItem value="">select</MenuItem>
              {addressList.map((e, i) => (
                <MenuItem key={i} value={e}>
                  {e.name + "-->" + e.street + " " + e.city + ", " + e.state}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <p style={{ textAlign: "center" }}>-OR-</p>
          <form className="registerForm1" style={{ marginTop: "20px" }}>
            <div style={{ fontSize: "x-large", textAlign: "center" }}>
              Add Address
            </div>
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <TextField
              name="contactNumber"
              variant="outlined"
              label="Contact number"
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <TextField
              name="street"
              variant="outlined"
              label="Street"
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <TextField
              name="city"
              variant="outlined"
              label="City"
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <TextField
              name="state"
              variant="outlined"
              label="State"
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <TextField
              name="landmark"
              variant="outlined"
              label="landmark"
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <TextField
              name="zipcode"
              variant="outlined"
              label="zipcode"
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <button type="button" onClick={addAddress} className="loginBtn">
              Save Address
            </button>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                style={{
                  marginTop: "10px",
                  marginRight: "20px",
                  color: "black",
                }}
                size="medium"
                variant="text"
                onClick={goToOrder}
              >
                BACK
              </Button>
              <Button
                style={{ marginTop: "10px", backgroundColor: "#3f51b5" }}
                size="medium"
                variant="contained"
                color="primary"
                onClick={nextstep}
              >
                NEXT
              </Button>
            </div>
          </form>
        </>
      )}
      {finalstep && (
        <>
          <div className="finalStep">
            {details && (
              <div style={{ width: "60%", borderRight: "2px solid #80808045" }}>
                <div className="headingText">{details.name}</div>
                <p>
                  Quantity: <span style={{ fontWeight: "bold" }}>{qty}</span>
                </p>
                <p>
                  Category:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {details.category.toUpperCase()}
                  </span>
                </p>
                <p>
                  <em>{details.description}</em>
                </p>
                <div style={{ color: "red", fontSize: "x-large" }}>
                  Total Price :<CurrencyRupeeIcon /> {details.price * qty}
                </div>
              </div>
            )}
            <div className="addressDetails" style={{ width: "40%" }}>
              <div className="headingText">Address Details :</div>
              <p>{address.street}</p>
              <p>Contact Number : {address.contactNumber}</p>
              <p>{address.landmark}</p>
              <p>{address.state}</p>
              <p>{address.zipcode}</p>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              style={{
                marginTop: "10px",
                marginRight: "20px",
                color: "black",
              }}
              size="medium"
              variant="text"
              onClick={midStep}
            >
              BACK
            </Button>
            <Button
              style={{ marginTop: "10px", backgroundColor: "#3f51b5" }}
              size="medium"
              variant="contained"
              onClick={placeOrder}
            >
              PLACE ORDER
            </Button>
          </div>
        </>
      )}
      <ToastNotification
        open={notification.open}
        type={notification.type}
        message={notification.message}
        handleClose={handleClose}
      />
    </div>
  );
}
