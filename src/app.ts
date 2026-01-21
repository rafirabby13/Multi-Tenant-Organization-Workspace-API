import express, { Application, NextFunction, Request, Response } from 'express';
import { config } from './config';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app: Application = express();
// app.post(
//   '/webhook',
//   express.raw({ type: 'application/json' }), 
//   PaymentController.handleWebhook
// );
app.use(cors());


//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1", router)

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Server is running..",
        environment: config.node_env,
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString()
    })
});

app.use(globalErrorHandler);


export default app;