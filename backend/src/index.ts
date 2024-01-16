require("dotenv").config();
import express from "express";
import cors from "cors";
import { router as protocolRoutes } from './routes/protocolRoutes';
import { router as protocolTypeRoutes } from './routes/protocolTypeRoutes';
import { router as logoRouter } from './routes/logoRoutes';
import { router as mailRouter } from './routes/mailRoutes';
import { router as socialRouter } from './routes/socialRoutes';
import { router as categoryRouter } from './routes/attendanceCategoryRoutes';
import { router as authRouter } from './routes/authRoutes';
import { router as userRouter } from './routes/userRoutes';
import { router as legalRouter } from './routes/legalRoutes';
import { router as sessionRouter } from './routes/sessionRoutes';
const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'})); //enhance payload limit
const port = process.env.PORT;

app.use(express.json());
app.use("/api/protocols", protocolRoutes);
app.use("/api/protocol-types", protocolTypeRoutes);
app.use("/api/logo", logoRouter);
app.use("/api/mails", mailRouter);
app.use("/api/socials", socialRouter);
app.use("/api/attendance-categories", categoryRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/legals", legalRouter);
app.use("/api/session", sessionRouter);

app.listen(port, () => console.log(`Listening on Port ${port}`));