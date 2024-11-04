import { treaty } from "@elysiajs/eden";
import type { App } from "../../../backend/src";

// @ts-ignore
export default treaty<App>(
  "http://193.107.32.226:5173/api/",
  {
    fetch: {
      credentials: "include",
    },
  },
);
