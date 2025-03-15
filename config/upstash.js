import {Client as WorkflowClient} from '@upstash/workflow';
import { config } from 'dotenv'; 
config({ path: './config/config.env' });

export const workflowClient = new WorkflowClient({
    baseUrl: process.env.QSTASH_URL,
    token: process.env.QSTASH_TOKEN
});