require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
const port = process.env.PORT;

app.use(express.json());
app.use("/api/protocols", require("./routes/protocolRoutes"));
app.use("/api/protocol-types", require("./routes/protocolTypeRoutes"));

app.listen(port, () => console.log(`Listening on Port ${port}`));
