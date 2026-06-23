import { body, param, query } from "express-validator";

export const createProjectValidationRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("status")
    .optional()
    .isString()
    .isIn(["Active", "Completed", "Archived"]),
];

export const getProjectByIdValidationRules = [
  param("id").isUUID().withMessage("Project ID must be a UUID"),
];

export const updateProjectValidationRules = [
  param("id").isUUID().withMessage("Project ID must be a UUID"),
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("status")
    .optional()
    .isString()
    .isIn(["Active", "Completed", "Archived"])
    .withMessage("Status must be one of Active, Completed, or Archived"),
];

export const deleteProjectValidationRules = [
  param("id").isUUID().withMessage("Project ID must be a UUID"),
];

export const getProjectsValidationRules = [
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
    .isIn(["title", "status", "createdAt", "updatedAt"])
    .withMessage(
      "sortBy must be one of title, status, createdAt, or updatedAt",
    ),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("order must be asc or desc"),
];
