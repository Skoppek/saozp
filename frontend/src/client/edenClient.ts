import { treaty } from "@elysiajs/eden";
import type { App } from "../../../backend/src";

// @ts-ignore
export default treaty<App>(
  import.meta.env.VITE_API_URL,
  {
    fetch: {
      credentials: "include",
    },
  },
);
