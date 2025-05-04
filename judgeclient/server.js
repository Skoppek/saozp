const express = require("express");
const axios = require("axios"); // Using axios to make API requests

const app = express();
const PORT = 3002;

// const judge0Url = 'http://host.docker.internal:2358';
const judge0Url = "http://localhost:2358";

let failuresCount = 0;

setInterval(() => {
  if (failuresCount > 0) {
    console.warn(`Encoutered ${failuresCount} failures in the last 5 min.`);
    failuresCount = 0;
  }
}, 60 * 1_000)

app.use(express.json());

app
  .get("/about", async (req, res) => {
    await axios
      .get(`${judge0Url}/about`, {
        params: req.query,
      })
      .then((judgeRes) => res.json(judgeRes.data));
  })
  .get("/submissions/batch", async (req, res) => {
    try {
      await axios
      .get(`${judge0Url}/submissions/batch`, {
        params: req.query,
      })
      .then((judgeRes) => res.json(judgeRes.data));
    } catch {
      failuresCount += 1;
      res.status(500)
    }
  })
  .get("/languages/:id", async (req, res) => {
    await axios
      .get(`${judge0Url}/languages/${req.params.id}`)
      .then((judgeRes) => res.json(judgeRes.data));
  })
  .post("/submissions", async (req, res) => {
    try {
      await axios
      .post(`${judge0Url}/submissions`, req.body)
      .then((judgeRes) => res.json(judgeRes.data));
    } catch {
      failuresCount += 1;
      res.status(500)
    }
  });

app.listen(PORT, () => {
  console.log(`JudgeClient server is running on port ${PORT}`);
});
