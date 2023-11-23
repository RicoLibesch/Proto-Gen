require("dotenv").config();
import express from "express";
import cors from "cors";
import { router as protocolRoutes } from './routes/protocolRoutes';
import { router as protocolTypeRoutes } from './routes/protocolTypeRoutes';
const app = express();

app.use(cors());
const port = process.env.PORT;

app.use(express.json());
app.use("/api/protocols", protocolRoutes);
app.use("/api/protocol-types", protocolTypeRoutes);

app.listen(port, () => console.log(`Listening on Port ${port}`));