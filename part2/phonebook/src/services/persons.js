import axios from 'axios';
const baseUrl = '/api/persons';

const getResponseData = (res) => res.data;

const getAllPersons = () => {
  const req = axios.get(baseUrl);
  return req.then(getResponseData);
};

const createPerson = (newPerson) => {
  const req = axios.post(baseUrl, newPerson);
  return req.then(getResponseData);
};

const deletePerson = (id) => {
  const req = axios.delete(`${baseUrl}/${id}`);
  return req.then(getResponseData);
};

const updatePerson = (updatedPerson) => {
  const req = axios.put(`${baseUrl}/${updatedPerson.id}`, updatedPerson);
  return req.then(getResponseData);
};

export { createPerson, deletePerson, getAllPersons, updatePerson };
