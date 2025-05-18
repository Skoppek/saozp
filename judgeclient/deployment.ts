const DEPLOYMENTS = ["dev", "dev-compose", "prod"] as const;
export type Deployment = (typeof DEPLOYMENTS)[number];

const isDeployment = (suspect: unknown): suspect is Deployment => {
  return (
    !!suspect && typeof suspect === "string" && DEPLOYMENTS.includes(suspect as Deployment)
  );
};

const DEPLOYMENT = process.env.DEPLOYMENT;

if (!isDeployment(DEPLOYMENT)) {
  console.error(
    `[ERR] | ${new Date().toLocaleString()} | Wrong DEPLOYMENT mode specified. Expected ${DEPLOYMENTS.join(
      " | "
    )} but got ${DEPLOYMENT}`
  );
  process.exit(1)
}

const judge0Url =
  DEPLOYMENT == "dev"
    ? "host.docker.internal:2358"
    : DEPLOYMENT == "dev-compose"
    ? "host.docker.internal:2358"
    : "172.18.0.5:2358";

export default {
  DEPLOYMENT,
  judge0Url
}