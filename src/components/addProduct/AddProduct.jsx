import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_details, logData, post_login } from "../../common/fetch";
import { TextField } from "@mui/material";
import { ToastNotification } from "../../common/services";
import CreatableSelect from "react-select/creatable";
import "./AddProduct.css";
export default function AddProduct() {
  const navigate = useNavigate();
  const [prodCategories, setProdCategories] = useState([]);
  const [data, setData] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
    manufacturer: "",
    availableItems: "",
    imageUrl: "",
  });
  const [notification, setNotification] = useState({
    open: false,
    type: "",
    message: "",
  });
  const getCategories = async () => {
    await get_details("/products/categories")
      .then((res) => {
        let a = res.data.map((e) => {
          return { value: e, label: e, name: "category" };
        });
        setProdCategories(a);
      })
      .catch((e) => {
        setNotification({
          open: true,
          type: "error",
          message: e.response.data.message,
        });
      });
  };
  const handleClose = () => {
    setNotification({ open: false, message: "" });
  };

  const addProduct = async () => {
    if (
      data.name.trim().length === 0 ||
      data.category.trim().length === 0 ||
      Number(data.price) === 0 ||
      data.description.trim().length === 0 ||
      data.manufacturer.trim().length === 0 ||
      data.availableItems.trim().length === 0 ||
      data.imageUrl.trim().length === 0
    ) {
      setNotification({
        open: true,
        type: "error",
        message: "Fill all the details",
      });

      return;
    }
    await post_login("/products", data)
      .then((res) => {
        navigate("/products", {
          state: {
            open: true,
            type: "success",
            message: "Product added successfully",
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
  const handleChange = (e, actiondata) => {
    let name = "",
      value = "";
    if (actiondata && e.action == "create-option") {
      name = "category";
      value = actiondata.value;
    } else if (actiondata) {
      name = actiondata.name;
      value = actiondata.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    setData({ ...data, [name]: value });
  };
  useEffect(() => {
    if (prodCategories.length == 0) getCategories();
  });
  useEffect(() => {
    if (!logData()) {
      navigate("/login");
    } else {
    }
  });
  return (
    <div>
      <form className="registerForm1">
        <h3 style={{ marginTop: "5px" }}>Add Product</h3>
        <TextField
          name="name"
          label="Name"
          variant="outlined"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        {/* <TextField
          name="category"
          variant="outlined"
          label="Category"
          onChange={(e) => {
            handleChange(e);
          }}
        /> */}
        <CreatableSelect
          className="categorySelect"
          name="category"
          onChange={(e, actionMeta) => {
            handleChange(actionMeta, e);
          }}
          options={prodCategories}
        />
        <TextField
          name="manufacturer"
          variant="outlined"
          label="manufacturer"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <TextField
          name="price"
          type="number"
          variant="outlined"
          label="Price"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <TextField
          name="availableItems"
          variant="outlined"
          label="availableItems"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <TextField
          name="imageUrl"
          variant="outlined"
          label="Image Url"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <TextField
          name="description"
          variant="outlined"
          label="description"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <button type="button" onClick={addProduct} className="loginBtn">
          Save Product
        </button>
      </form>
      <ToastNotification
        open={notification.open}
        type={notification.type}
        message={notification.message}
        handleClose={handleClose}
      />
    </div>
  );
}
