
import { createServer } from '../server';
import serverless from 'serverless-http';

const app = createServer();

export default serverless(app);
