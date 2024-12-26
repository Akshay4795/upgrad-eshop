import axios from "axios";
// Add the Token value after sign api call
let token =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJha3NoYXlwYXRpbGJhYWFAZ21haWwuY29tIiwiaWF0IjoxNzM1MTgyNjM0LCJleHAiOjE3MzUxOTEwMzR9.4wl2i3L2BWyXqpghgEs1BgWUGAADHqX9l9giEl4N3o7E0oRNaZ09dx6MGp7LhMUBp6cwjSOdGs6SHTLPumT5NQ";

// api service to call the API endpoints
const apiservice = axios.create({
  baseURL: "https://dev-project-ecommerce.upgrad.dev/api/",
});

//Post Call for POST form data to api endpoint
const post_data = (endpoint, data, _headers) => {
  var headers1 = { "content-type": "application/json" };
  if (_headers) {
    try {
      Object.entries(_headers).map(([key], [value]) => {
        headers1[key] = value;
        return null;
      });
    } catch (_) {}
  }
  return apiservice.post(endpoint, data, { headers: headers1 });
};
// To log the token and username in localStorage
const logData = () => {
  if (
    localStorage.getItem("token") == "" ||
    token != localStorage.getItem("token")
  ) {
    localStorage.setItem("token", token);
  }

  if (localStorage.getItem("role")) {
    let obj = {
      token: localStorage.getItem("token"),
      role: localStorage.getItem("role"),
    };
    return obj;
  } else {
    return null;
  }
};
//To get request from API endpoint
const get_data = (endpoint, params) => {
  var hdrs = {
    "Content-Type": "application/json",
    "x-auth-token": token,
  };
  return apiservice.get(endpoint, { params: params }, { headers: hdrs });
};
//To get details for address and products
const get_details = (endpoint) => {
  var hdrs = {
    "Content-Type": "application/json",
    "x-auth-token": token,
  };
  return apiservice.get(endpoint, { headers: hdrs });
};

// To add new Address or place order api endpoint will be used
const post_login = (endpoint, data) => {
  var hdrs = {
    "Content-Type": "application/json",
    "x-auth-token": token,
  };
  return apiservice.post(endpoint, data, { headers: hdrs });
};
//To update the product this endpoint will be used
const put_login = (endpoint, data) => {
  var hdrs = {
    "Content-Type": "application/json",
    "x-auth-token": token,
  };
  return apiservice.put(endpoint, data, { headers: hdrs });
};
//To delete the product this function will be used to hit the endpoint
const delete_login = (endpoint) => {
  var hdrs = {
    "Content-Type": "application/json",
    "x-auth-token": token,
  };
  return apiservice.delete(endpoint, { headers: hdrs });
};

export {
  logData,
  post_data,
  get_data,
  get_details,
  post_login,
  put_login,
  delete_login,
};
