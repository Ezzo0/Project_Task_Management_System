import { AppDataSource } from "../utils/data-source";
import { Task } from "../entities/Task";
import { getProjectById } from "./project.service";

const taskRepository = AppDataSource.getRepository(Task);

// Helpers to remove timestamp fields from responses
const sanitizeTask = (task: any, ...excludeFields: string[]) => {
  if (!task) return task;
  return Object.fromEntries(
    Object.entries(task).filter(([key]) => !excludeFields.includes(key)),
  );
};

export const createTask = async (
  userId: string,
  projectId: string,
  title: string,
  description?: string,
  status?: string,
  priority?: string,
  dueDate?: string,
) => {
  const project = await getProjectById(userId, projectId);
  const task = taskRepository.create({
    title,
    description,
    status: status || "Pending",
    priority: priority || "Medium",
    dueDate,
    project,
  });
  const saved = await taskRepository.save(task);
  return sanitizeTask(saved, "project", "createdAt", "updatedAt");
};

export const getTasks = async (
  userId: string,
  projectId: string,
  status?: string,
  priority?: string,
  page = 1,
  limit = 10,
  sortBy?: string,
  order: string = "asc",
) => {
  await getProjectById(userId, projectId);

  const query = taskRepository
    .createQueryBuilder("task")
    .select(["task.id", "task.title", "task.status"])
    .where("task.projectId = :projectId", { projectId });

  if (status) query.andWhere("task.status = :status", { status });
  if (priority) query.andWhere("task.priority = :priority", { priority });
  if (sortBy) {
    query.orderBy(`task.${sortBy}`, order.toUpperCase() as "ASC" | "DESC");
  }

  query.skip((page - 1) * limit).take(limit);

  const [tasks, total] = await query.getManyAndCount();
  return {
    data: tasks,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTaskById = async (
  userId: string,
  projectId: string,
  taskId: string,
) => {
  await getProjectById(userId, projectId);
  const task = await taskRepository.findOne({
    where: { id: taskId, project: { id: projectId } },
  });
  if (!task) throw { status: 404, message: "Task not found" };
  return task;
};

export const updateTask = async (
  userId: string,
  projectId: string,
  taskId: string,
  data: Partial<Task>,
) => {
  const task = await getTaskById(userId, projectId, taskId);
  Object.assign(task, data);
  task.updatedAt = new Date();
  return taskRepository.save(task);
};

export const deleteTask = async (
  userId: string,
  projectId: string,
  taskId: string,
) => {
  const task = await getTaskById(userId, projectId, taskId);
  await taskRepository.remove(task);
  return { message: "Task deleted successfully" };
};
