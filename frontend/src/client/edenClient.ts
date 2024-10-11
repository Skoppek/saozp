import { treaty } from "@elysiajs/eden";
import type { App } from "../../../backend/src";

// @ts-ignore
export default treaty<App>("http://localhost:5173/api/", {
  fetch: {
    credentials: "include",
  },
});
