import { Request, Response, NextFunction } from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
  getProjectsWithCreators,
  getProjectStatistics,
} from "../services/project.service";

const getUserId = (req: Request) => (req as any).userId as string;

export const getProjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sortBy = req.query.sortBy as string | undefined;
    const order = (req.query.order as string | undefined) || "asc";
    const projects = await getProjects(
      getUserId(req),
      page,
      limit,
      sortBy,
      order,
    );
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const createProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const project = await createProject(
      getUserId(req),
      req.body.title,
      req.body.description,
      req.body.status,
    );
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const getProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const project = await getProjectById(getUserId(req), req.params.id);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const project = await updateProject(
      getUserId(req),
      req.params.id,
      req.body,
    );
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await deleteProject(getUserId(req), req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getProjectsWithCreatorsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projects = await getProjectsWithCreators();
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await getProjectStatistics();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
