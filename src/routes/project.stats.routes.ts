import { Router } from "express";
import {
  getProjectsWithCreatorsController,
  getProjectStatsController,
} from "../controllers/project.controller";
import { authorize } from "../middlewares/role.middleware";

export const projectStatsRouter = Router();

// Admin-only statistics and reporting routes.
projectStatsRouter.get(
  "/with-users",
  authorize("admin"),
  getProjectsWithCreatorsController,
);
projectStatsRouter.get("/stats", authorize("admin"), getProjectStatsController);
