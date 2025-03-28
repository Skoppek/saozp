import { treaty } from "@elysiajs/eden";
import type { App } from "../../../backend/src";

// @ts-expect-error yes
export default treaty<App>(
  import.meta.env.VITE_API_URL,
  {
    fetch: {
      credentials: "include",
    }
  },
);
