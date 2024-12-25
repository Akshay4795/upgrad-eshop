import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { delete_login, get_details, logData } from "../../common/fetch";
import { AlertDialog, ToastNotification } from "../../common/services";
import "./Home.css";
let deleteProductId = "";
let deleteProductName = "";
export default function Home() {
  const [loggdata, setloggdata] = useState(logData());
  const [products1, setProducts1] = useState([]);
  const [products, setProducts] = useState([]);
  const [categeries, setCategories] = useState(["ALL"]);
  const [notification, setNotification] = useState({
    open: false,
    type: "",
    message: "",
  });

  const [open, setOpen] = useState(false);

  const [alignment, setAlignment] = useState("ALL");

  const location = useLocation();
  const navigate = useNavigate();

  const { state } = location;

  const handleCloseAlert = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setNotification({ open: false, message: "" });
  };
  const handleConfirm = () => {
    deleteProduct(deleteProductId);
    deleteProductId = "";
    handleCloseAlert();
  };

  const handleChange = (event, newAlignment) => {
    if (newAlignment === null) newAlignment = "ALL";
    if (newAlignment === "ALL") {
      getProducts();
    } else if (newAlignment != null) {
      //products1
      let a = [...products1];
      a = a.filter((e, i) => e.category === newAlignment);
      setProducts(a);
    }
    setAlignment(newAlignment);
  };
  const getProducts = async () => {
    await get_details("/products")
      .then((res) => {
        setProducts1(res.data);
        setProducts(res.data);
      })
      .catch((e) => {
        setNotification({
          open: true,
          type: "error",
          message: e.response.data.message,
        });
      });
  };
  const handleSort = (e) => {
    console.log(e);
    let a = [...products];
    if (e.target.value === "asc") {
      a.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      setProducts(a);
    }
    if (e.target.value === "desc") {
      a.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      setProducts(a);
    }
    if (e.target.value === "new") {
      a.reverse();
      setProducts(a);
    }
    if (e.target.value === "def") {
      handleChange(e, alignment);
    }
  };
  const getCategories = async () => {
    await get_details("/products/categories")
      .then((res) => {
        let a = ["ALL"];
        a = a.concat(res.data);
        setCategories(a);
      })
      .catch((e) => {
        setNotification({
          open: true,
          type: "error",
          message: e.response.data.message,
        });
      });
  };

  const delteSwal = (id, name) => {
    deleteProductId = id;
    deleteProductName = name;
    setOpen(true);
  };

  const deleteProduct = async (id) => {
    await delete_login("/products/" + id)
      .then((res) => {
        getProducts();
        setNotification({
          open: true,
          type: "success",
          message: "Product " + deleteProductName + " deleted Successfully",
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

  useEffect(() => {
    setloggdata(logData());
    if (!loggdata) {
      navigate("/login");
    } else {
      if (state != null) {
        setNotification({
          open: location.state.open,
          type: location.state.type,
          message: location.state.message,
        });
        navigate(location.pathname, { replace: true, state: {} });
      }
      getCategories();
      getProducts();
    }
  }, []);

  useEffect(() => {
    let a = [];
    if (location.pathname.split("/").length > 2) {
      let a = products1;
      a = a.filter((e) => {
        console.log(
          e.name,
          e.name
            .toLowerCase()
            .includes(location.pathname.split("/")[2].toLowerCase())
        );
        return e.name
          .toLowerCase()
          .includes(location.pathname.split("/")[2].toLowerCase());
      });
      setProducts(a);
    } else {
      getProducts();
    }
  }, [location]);

  return (
    <div style={{ paddingLeft: "2%", paddingRight: "2%" }}>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        style={{
          marginTop: "30px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {categeries.map((e, i) => (
          <ToggleButton key={i} value={e}>
            {e}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <div
        style={{
          marginLeft: "50px",
          display: "flex",
          width: "300px",
          flexWrap: "wrap",
        }}
      >
        <div>Sort by:</div>
        <TextField
          id="outlined-select-currency"
          size="small"
          select
          placeholder="Select..."
          onChange={(e) => {
            handleSort(e);
          }}
          style={{ width: "100%", textAlign: "start" }}
        >
          <MenuItem value="def">Default</MenuItem>
          <MenuItem value="asc">Price:Low to High</MenuItem>
          <MenuItem value="desc">Price:High to Low</MenuItem>
          <MenuItem value="new">Newest</MenuItem>
        </TextField>
      </div>
      <div className="card-parent">
        {products.map((item) => (
          <Card
            key={item.id}
            sx={{ maxWidth: 450, padding: "10px", maxHeight: 550 }}
          >
            <CardMedia
              component="img"
              alt="green iguana"
              height="250px"
              image={item.imageUrl}
            />
            <CardContent style={{ height: "150px", overflowY: "auto" }}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>{item.name}</span>
                <span>₹ {item.price}</span>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {
                  /*item.description.length > 100
                  ? item.description.slice(1, 100) + "..."
                  : item.description*/ item.description
                }
              </Typography>
            </CardContent>
            <CardActions
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button
                style={{ backgroundColor: "#3f51b5" }}
                size="small"
                variant="contained"
                onClick={() => {
                  navigate("/product/" + item.id);
                }}
              >
                Buy
              </Button>
              {loggdata?.role === "ADMIN" && (
                <div>
                  <Button
                    style={{ color: "gray" }}
                    size="small"
                    onClick={() => {
                      navigate("/editproduct/" + item.id);
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    style={{ color: "gray" }}
                    size="small"
                    onClick={() => {
                      delteSwal(item.id, item.name);
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              )}
            </CardActions>
          </Card>
        ))}
      </div>

      <ToastNotification
        open={notification.open}
        type={notification.type}
        message={notification.message}
        handleClose={handleClose}
      />
      <AlertDialog
        open={open}
        handleClose={handleCloseAlert}
        handleConfirm={handleConfirm}
      />
    </div>
  );
}
