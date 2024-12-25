import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get_details, logData } from "../../common/fetch";
import { ToastNotification } from "../../common/services";
import "./ProductDetails.css";
import { Button, Chip, TextField } from "@mui/material";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [details, setDetails] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    type: "",
    message: "",
  });
  const handleClose = () => {
    setNotification({ open: false, message: "" });
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
  const placeOrder = () => {
    if (quantity && quantity > 0) {
      navigate("/addaddress/" + id + "/" + quantity);
    } else {
      setNotification({
        open: true,
        type: "error",
        message: "select Quantity",
      });
    }
  };
  useEffect(() => {
    if (!logData()) {
      navigate("/login");
    } else {
      getProductDetails();
    }
  }, [id]);

  return (
    <div className="detailsParentDiv">
      {details && (
        <div className="detailsDiv">
          <div className="prodImage">
            <img src={details.imageUrl} alt={details.name} srcSet="" />
          </div>
          <div className="proddetails">
            <div style={{ display: "flex", alignItems: "center" }}>
              <h2 style={{ marginRight: "20px" }}>{details.name}</h2>
              <Chip
                style={{ backgroundColor: "#3f51b5" }}
                label={"Available Quantity :" + details.availableItems}
                color="primary"
              />
            </div>
            <p style={{ marginTop: "0" }}>
              Category : <b>{details.category}</b>
            </p>
            <p>{details.description}</p>
            <div
              style={{
                color: "red",
                fontWeight: 500,
                fontSize: "x-large",
                marginBottom: "4%",
              }}
            >
              ₹ {details.price}
            </div>
            <br />
            <TextField
              style={{ width: "60%" }}
              size="small"
              type="number"
              name="quantity"
              variant="outlined"
              value={quantity}
              label="Quantity"
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
            />
            <br />
            <Button
              style={{ marginTop: "10px", backgroundColor: "#3f51b5" }}
              size="medium"
              variant="contained"
              onClick={placeOrder}
            >
              PLACE ORDER
            </Button>
          </div>
        </div>
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
