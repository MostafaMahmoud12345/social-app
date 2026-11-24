
import express from 'express'
import {router} from "./route"
import cookieParser from "cookie-parser";
import cors from 'cors'
export function createApp(){
    const app = express()
  app.use(cors({ origin: "http://localhost:4200" }));
  app.use(cookieParser());
    app.use(express.json())
    app.use('/api',router)
return app
}
