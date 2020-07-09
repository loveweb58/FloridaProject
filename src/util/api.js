import axios from "axios";

// const API_ROOT = '/api/'; // root of the api url
// const API_ROOT = "http://localhost:3001/api/"; // root of the api url
const API_ROOT = "https://lssfl.net/api/"; // root of the api url

const responseBody = res => res.data; // an arrow function to takes only the data value from the response object
// an arrow function to takes only the response body from error response.
const errBody = res => {
  throw res.response && res.response.data;
};

// axios configuration object. this has header values with token.
const axiosConfig = () => {
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");
  return {
    headers: {
      token: token || "",
      'admin-header': adminToken,
    }
  };
};

const to = promise =>
  promise.then(data => [null, data]).catch(err => [err, null]);

// general 4 types of requests
const request = base => ({
  get: (url = '') =>
    to(
      axios
        .get(`${API_ROOT}${base + url}`, axiosConfig())
        .then(responseBody)
        .catch(errBody)
    ),
  post: (url = '', body) =>
    to(
      axios
        .post(`${API_ROOT}${base + url}`, body, axiosConfig())
        .then(responseBody)
        .catch(errBody)
    ),
  put: (url = '', body) =>
    to(
      axios
        .put(`${API_ROOT}${base + url}`, body, axiosConfig())
        .then(responseBody)
        .catch(errBody)
    ),
  patch: (url='', body) =>
    to(
      axios
        .patch(`${API_ROOT}${base + url}`, body, axiosConfig())
        .then(responseBody)
        .catch(errBody)
    ),
  del: (url = '') =>
    to(
      axios
        .delete(`${API_ROOT}${base + url}`, axiosConfig())
        .then(responseBody)
        .catch(errBody)
    )
});

export const API = request('');
export const CustomerAPI = request("customer/");
export const UserAPI = request("Users/");
export const LoanAPI = request("loan/");
