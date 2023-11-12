"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const pool = require('./db');
const express = require("express");
const app = express();
app.get("/", (req, res) => {
    res.status(200).send("<h2>Hi there TypeScript</h2>");
    console.log(process.env.DB_HOST);
});
app.get("/test", async (req, res) => {
    try {
        await pool.query('CREATE TABLE test_table( id SERIAL PRIMARY KEY, name VARCHAR(100), description VARCHAR(100))');
        res.status(200).send({ message: "YEET" });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
app.get("/insert", async (req, res) => {
    try {
        await pool.query('INSERT INTO test_table(name, description) VALUES ($1, $2)', ["Jonas", "Überking"]);
        res.status(200).send({ message: "Added." });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on Port ${port}`));
//# sourceMappingURL=index.js.map