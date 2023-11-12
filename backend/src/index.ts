require('dotenv').config();
const express = require("express");
const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use("/api/protocols", require("./routes/protocolRoutes"));

app.listen(port, () => console.log(`Listening on Port ${port}`));
