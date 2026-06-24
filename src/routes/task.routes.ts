import { Router } from "express";
import {
  createTaskController,
  deleteTaskController,
  getTaskController,
  getTasksController,
  updateTaskController,
} from "../controllers/task.controller";
import { validateRequest } from "../middlewares/validate.middleware";
import {
  getTasksValidationRules,
  createTaskValidationRules,
  getTaskByIdValidationRules,
  updateTaskValidationRules,
  deleteTaskValidationRules,
} from "../validators/task.validators";

export const taskRouter = Router({ mergeParams: true });

taskRouter.get(
  "/",
  getTasksValidationRules,
  validateRequest,
  getTasksController,
);

taskRouter.post(
  "/",
  createTaskValidationRules,
  validateRequest,
  createTaskController,
);

taskRouter.get(
  "/:taskId",
  getTaskByIdValidationRules,
  validateRequest,
  getTaskController,
);

taskRouter.patch(
  "/:taskId",
  updateTaskValidationRules,
  validateRequest,
  updateTaskController,
);

taskRouter.delete(
  "/:taskId",
  deleteTaskValidationRules,
  validateRequest,
  deleteTaskController,
);
