const HOST_IP = process.env.HOST_IP;
const JUDGE0_PORT = process.env.JUDGE0_PORT;

if (!HOST_IP || !JUDGE0_PORT) {
  console.error(
    `[ERR] | ${new Date().toLocaleString()} | Missing HOST_IP or JUDGE0_PORT env variables.`
  );
  process.exit(1)
}

export default `http://${HOST_IP}:${JUDGE0_PORT}`