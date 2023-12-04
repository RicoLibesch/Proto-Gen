require("dotenv").config();
import express from "express";
import cors from "cors";
import { router as protocolRoutes } from './routes/protocolRoutes';
import { router as protocolTypeRoutes } from './routes/protocolTypeRoutes';
import { router as logoRouter } from './routes/logoRoutes';
import { router as mailRouter } from './routes/mailReceiverRoutes';
import { router as socialRouter } from './routes/socialRoutes';
import { router as categoryRouter } from './routes/attendanceCategoryRoutes';
const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'})); //enhance payload limit
const port = process.env.PORT;

app.use(express.json());
app.use("/api/protocols", protocolRoutes);
app.use("/api/protocol-types", protocolTypeRoutes);
app.use("/api/logo", logoRouter);
app.use("/api/mail-receiver", mailRouter);
app.use("/api/socials", socialRouter);
app.use("/api/attendance-categories", categoryRouter);

app.listen(port, () => console.log(`Listening on Port ${port}`));