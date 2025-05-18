import deployment from "./deployment.js";

import express from 'express' 
import axios from 'axios' 

const app = express();
const PORT = 3002;

const { judge0Url } = deployment;

console.log(`Judge0 address: ${judge0Url}`);

try {
  console.log("Testing connection to Judge0");
  await axios
  .get(`${judge0Url}/about`)
  .then((judgeRes) => {
    console.log(`[INFO] | ${new Date().toLocaleString()} | Connection to Judge0 established.`);
    console.log(judgeRes.data);
  });
} catch {
  console.error(`[ERR] | ${new Date().toLocaleString()} | Failed to connect to Judge0. Exiting.`);
  process.exit(1)
}

let failuresCount = 0;

setInterval(() => {
  if (failuresCount > 0) {
    console.warn(`Encoutered ${failuresCount} failures in the last 5 min.`);
    failuresCount = 0;
  }
}, 60 * 1_000);

app.use(express.json());

app
  .get("/about", async (req, res) => {
    try {
      console.log(
        `[INFO] | ${new Date().toDateString()} | About call from ${req.ip}`
      );
      await axios
        .get(`${judge0Url}/about`, {
          params: req.query,
        })
        .then((judgeRes) => res.json(judgeRes.data));
    } catch (err) {
      console.error(
        `[ERR] | ${new Date().toDateString()} | Failed to get an about endpoint`
      );
      res.json(err);
    }
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
      res.status(500);
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
      res.status(500);
    }
  });

app.listen(PORT, () => {
  console.log(`JudgeClient server is running on port ${PORT}`);
});
