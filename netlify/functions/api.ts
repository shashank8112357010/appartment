import serverless from "serverless-http";
import { createServer } from "../../server";

let handler: any;

export const main = async (event: any, context: any) => {
  if (!handler) {
    const app = await createServer();
    handler = serverless(app);
  }
  return handler(event, context);
};

export { main as handler };
