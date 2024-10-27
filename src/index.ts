import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import prisma from './utils/db';
import testDatabaseConnection from './utils/dbconn';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

async function startServer() {
    await testDatabaseConnection().then(()=>{
       try {
        app.listen(port, () => {
            console.log(`🟢 Server is running on port ${port}`);
          });
       } catch (error) {
            console.log(`🔴`,error);    
       }
    })   
}


startServer();