import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.routes";
import { projectRouter } from "./routes/project.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { authMiddleware } from "./middlewares/auth.middleware";
import { AppDataSource } from "./utils/data-source";
import { projectStatsRouter } from "./routes/project.stats.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/projects", authMiddleware, projectRouter);
app.use("/api/admin/projects", authMiddleware, projectStatsRouter);

app.use(errorHandler);

const port = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Data Source initialization error:", error);
  });
