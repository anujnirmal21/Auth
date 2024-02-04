import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import router from "./routes/user.routes.js";

//routes declare
app.use("/api/v1/users", router);

export default app;
