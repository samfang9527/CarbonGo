
import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import { errorHandler } from "./utils/error";

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 8080;

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

