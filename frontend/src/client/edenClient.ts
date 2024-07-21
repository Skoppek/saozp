import { treaty } from "@elysiajs/eden";
import type { App } from "../../../backend/src";

export default treaty<App>(
  import.meta.env.VITE_SAOZP_BACKEND_URL ?? "http://localhost:3000",
);
