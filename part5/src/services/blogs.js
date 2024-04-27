import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;
const setToken = (newToken) => {
  console.log(newToken);
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  console.log(token);
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (blogUpdate) => {
  const config = {
    headers: { Authorization: token },
  };
  const url = baseUrl + '/' + blogUpdate.id;
  const response = await axios.put(url, blogUpdate, config);
  return response.data;
};
const removeBlog = async (blogToDelete) => {
  const config = {
    headers: { Authorization: token },
  };
  const url = baseUrl + '/' + blogToDelete.id;
  const response = await axios.delete(url, config);
  return response.data;
};

export default { getAll, create, setToken, update, removeBlog };
