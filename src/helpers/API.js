import axios from 'axios';

import { servicePath } from '../constants/defaultValues';

const API_ROOT = servicePath; // root of the api url

const responseBody = (res) => res.data; // an arrow function to takes only the data value from the response object
// an arrow function to takes only the response body from error response.
const errBody = (res) => {
  throw (res.response && res.response.data) || res;
};

// axios configuration object. this has header values with token.
const axiosConfig = (filter = null) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      token: token || '',
      filter,
    },
  };
};

const to = (promise) => promise.then((data) => [null, data]).catch((err) => [err, null]);

// general 5 types of requests
const request = (base) => ({
  get: async (url = '', filters) =>
    await to(
      axios
        .get(`${API_ROOT}${base + url}`, axiosConfig(filters))
        .then(responseBody)
        .catch(errBody),
    ),
  post: async (url = '', body) =>
    await to(
      axios
        .post(`${API_ROOT}${base + url}`, body, axiosConfig())
        .then(responseBody)
        .catch(errBody),
    ),
  put: async (url = '', body) =>
    await to(
      axios
        .put(`${API_ROOT}${base + url}`, body, axiosConfig())
        .then(responseBody)
        .catch(errBody),
    ),
  patch: async (url = '', body) =>
    await to(
      axios
        .patch(`${API_ROOT}${base + url}`, body, axiosConfig())
        .then(responseBody)
        .catch(errBody),
    ),
  del: async (url = '') =>
    await to(
      axios
        .delete(`${API_ROOT}${base + url}`, axiosConfig())
        .then(responseBody)
        .catch(errBody),
    ),
});

export const API = request('');
export const UserAPI = request('Users/');
export const PeopleAPI = request('People/');
export const CategoryAPI = request('Categories/');
export const SubCategoryAPI = request('SubCategories/');
export const MetaDataAPI = request('MetaData/');
export const MetaFieldsAPI = request('MetaFields/');
export const SavedMetaFieldAPI = request('SavedMetaFields/');
export const BoxAPI = request('Boxes/');
export const CombinedCaseAPI = request('CombinedCases/');
