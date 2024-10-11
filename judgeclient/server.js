const express = require('express');
const axios = require('axios'); // Using axios to make API requests

const app = express();
const PORT = 3002;

const judge0Url = 'http://host.docker.internal:2358/';

app.use(express.json());

app
 .get('/about', async (req, res) => {
  const apiResponse = await axios.get(`${judge0Url}about`, {
   params: req.query,
  });
  res.json(apiResponse.data);
 })
 .get('/submissions/batch', async (req, res) => {
  const apiResponse = await axios.get(`${judge0Url}/submissions/batch`, {
   params: req.query,
  });
  res.json(apiResponse.data);
 })
 .get('/languages/:id', async (req, res) => {
  const apiResponse = await axios.get(
   `${judge0Url}/languages/${req.params.id}`
  );
  res.json(apiResponse.data);
 })
 .post('/submissions', async (req, res) => {
  const apiResponse = await axios.post(`${judge0Url}/submissions`, req.body);
  res.json(apiResponse.data);
 });

app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
