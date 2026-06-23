import { body, param, query } from "express-validator";

export const getTasksValidationRules = [
  param("projectId").isUUID().withMessage("Project ID must be a UUID"),
  query("status")
    .optional()
    .isIn(["Pending", "In Progress", "Done"])
    .withMessage("Status must be one of: Pending, In Progress, or Done"),
  query("priority")
    .optional()
    .isIn(["High", "Medium", "Low"])
    .withMessage("Priority must be one of: High, Medium, or Low"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
  query("sortBy")
    .optional()
    .isIn(["title", "status", "priority", "dueDate", "createdAt", "updatedAt"])
    .withMessage(
      "sortBy must be one of title, status, priority, dueDate, createdAt, or updatedAt",
    ),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("order must be asc or desc"),
];

export const createTaskValidationRules = [
  param("projectId").isUUID().withMessage("Project ID must be a UUID"),
  body("title").notEmpty().withMessage("Title is required"),
  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Done"])
    .withMessage("Status must be one of: Pending, In Progress, or Done"),
  body("priority")
    .optional()
    .isIn(["High", "Medium", "Low"])
    .withMessage("Priority must be one of: High, Medium, or Low"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

export const getTaskByIdValidationRules = [
  param("projectId").isUUID().withMessage("Project ID must be a UUID"),
  param("taskId").isUUID().withMessage("Task ID must be a UUID"),
];

export const updateTaskValidationRules = [
  param("projectId").isUUID().withMessage("Project ID must be a UUID"),
  param("taskId").isUUID().withMessage("Task ID must be a UUID"),
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Done"])
    .withMessage("Status must be one of: Pending, In Progress, or Done"),
  body("priority")
    .optional()
    .isIn(["High", "Medium", "Low"])
    .withMessage("Priority must be one of: High, Medium, or Low"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

export const deleteTaskValidationRules = [
  param("projectId").isUUID().withMessage("Project ID must be a UUID"),
  param("taskId").isUUID().withMessage("Task ID must be a UUID"),
];
