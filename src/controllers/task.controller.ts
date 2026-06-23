import { Request, Response, NextFunction } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../services/task.service";

const getUserId = (req: Request) => (req as any).userId as string;

export const getTasksController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sortBy = req.query.sortBy as string | undefined;
    const order = (req.query.order as string | undefined) || "asc";
    const tasks = await getTasks(
      getUserId(req),
      req.params.projectId,
      req.query.status as string,
      req.query.priority as string,
      page,
      limit,
      sortBy,
      order,
    );
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const task = await createTask(
      getUserId(req),
      req.params.projectId,
      req.body.title,
      req.body.description,
      req.body.status,
      req.body.priority,
      req.body.dueDate,
    );
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const task = await getTaskById(
      getUserId(req),
      req.params.projectId,
      req.params.taskId,
    );
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const task = await updateTask(
      getUserId(req),
      req.params.projectId,
      req.params.taskId,
      req.body,
    );
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await deleteTask(
      getUserId(req),
      req.params.projectId,
      req.params.taskId,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};
