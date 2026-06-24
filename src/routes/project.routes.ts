import { Router } from "express";
import { taskRouter } from "./task.routes";
import {
  createProjectController,
  deleteProjectController,
  getProjectController,
  getProjectsController,
  updateProjectController,
} from "../controllers/project.controller";
import { validateRequest } from "../middlewares/validate.middleware";
import {
  createProjectValidationRules,
  getProjectByIdValidationRules,
  updateProjectValidationRules,
  deleteProjectValidationRules,
  getProjectsValidationRules,
} from "../validators/project.validators";

export const projectRouter = Router();

// Project CRUD routes
projectRouter.get(
  "/",
  getProjectsValidationRules,
  validateRequest,
  getProjectsController,
);

projectRouter.post(
  "/",
  createProjectValidationRules,
  validateRequest,
  createProjectController,
);

projectRouter.get(
  "/:id",
  getProjectByIdValidationRules,
  validateRequest,
  getProjectController,
);

projectRouter.patch(
  "/:id",
  updateProjectValidationRules,
  validateRequest,
  updateProjectController,
);

projectRouter.delete(
  "/:id",
  deleteProjectValidationRules,
  validateRequest,
  deleteProjectController,
);

projectRouter.use("/:projectId/tasks", taskRouter);
