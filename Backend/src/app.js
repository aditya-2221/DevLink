import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(express.static("public"));

app.use(cookieParser());


//routes
import userRouter from "./routes/user.routes.js";
import projectRouter from "./routes/project.routes.js"
import recruitmentRouter from "./routes/recruitment.routes.js";
import teamRouter from "./routes/team.routes.js";
import taskRouter from "./routes/task.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import resourceRouter from "./routes/resource.routes.js";
import chatRouter from "./routes/chat.routes.js";
import searchRouter from "./routes/search.routes.js";
import aiRouter from "./routes/ai.routes.js";

app.get("/test", (req, res) => {
    res.json({ message: "Backend working" });
});

//routes declaration
app.use("/api/v1/users", userRouter)  // takes to https://localhost:8000/api/v1/users and furhter routes of user are added after /users
app.use("/api/v1/projects", projectRouter)
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/recruitments", recruitmentRouter);

app.use("/api/v1/teams", teamRouter);

app.use("/api/v1/tasks", taskRouter);

app.use("/api/v1/resources", resourceRouter);

app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/search", searchRouter);
export default app;