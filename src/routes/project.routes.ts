import { Router } from "express";
import {
  createProjectController,
  deleteProjectController,
  getProjectController,
  getProjectsController,
  updateProjectController,
} from "../controllers/project.controller";
import {
  createTaskController,
  deleteTaskController,
  getTaskController,
  getTasksController,
  updateTaskController,
} from "../controllers/task.controller";
import { validateRequest } from "../middlewares/validate.middleware";
import {
  createProjectValidationRules,
  getProjectByIdValidationRules,
  updateProjectValidationRules,
  deleteProjectValidationRules,
  getProjectsValidationRules,
} from "../validators/project.validators";

import {
  getTasksValidationRules,
  createTaskValidationRules,
  getTaskByIdValidationRules,
  updateTaskValidationRules,
  deleteTaskValidationRules,
} from "../validators/task.validators";

export const projectRouter = Router({ mergeParams: true });

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

projectRouter.get(
  "/:projectId/tasks",
  getTasksValidationRules,
  validateRequest,
  getTasksController,
);
projectRouter.post(
  "/:projectId/tasks",
  createTaskValidationRules,
  validateRequest,
  createTaskController,
);
projectRouter.get(
  "/:projectId/tasks/:taskId",
  getTaskByIdValidationRules,
  validateRequest,
  getTaskController,
);
projectRouter.patch(
  "/:projectId/tasks/:taskId",
  updateTaskValidationRules,
  validateRequest,
  updateTaskController,
);
projectRouter.delete(
  "/:projectId/tasks/:taskId",
  deleteTaskValidationRules,
  validateRequest,
  deleteTaskController,
);
