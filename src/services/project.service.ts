import { AppDataSource } from "../utils/data-source";
import { Project } from "../entities/Project";
import { User } from "../entities/User";

const projectRepository = AppDataSource.getRepository(Project);
const userRepository = AppDataSource.getRepository(User);

// Helpers to remove timestamp fields from responses
const sanitizeProject = (project: any, ...excludeFields: string[]) => {
  if (!project) return project;
  return Object.fromEntries(
    Object.entries(project).filter(([key]) => !excludeFields.includes(key)),
  );
};

export const createProject = async (
  userId: string,
  title: string,
  description?: string,
  status?: string,
) => {
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) throw { status: 404, message: "User not found" };

  const project = projectRepository.create({
    title,
    description,
    status: status || "Active",
    user,
  });
  const saved = await projectRepository.save(project);
  return sanitizeProject(saved, "user", "createdAt", "updatedAt");
};

export const getProjects = async (
  userId: string,
  page = 1,
  limit = 10,
  sortBy?: string,
  order: string = "asc",
) => {
  const query = projectRepository
    .createQueryBuilder("project")
    .select(["project.id", "project.title", "project.status"])
    .where("project.userId = :userId", { userId })
    .skip((page - 1) * limit)
    .take(limit);

  if (sortBy) {
    query.orderBy(`project.${sortBy}`, order.toUpperCase() as "ASC" | "DESC");
  }

  const [projects, total] = await query.getManyAndCount();
  return {
    data: projects,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProjectById = async (userId: string, projectId: string) => {
  const project = await projectRepository
    .createQueryBuilder("project")
    .leftJoinAndSelect("project.tasks", "task")
    .select([
      "project.id",
      "project.title",
      "project.description",
      "project.status",
      "task.id",
      "task.title",
      "task.status",
    ])
    .where("project.id = :projectId", { projectId })
    .andWhere("project.userId = :userId", { userId })
    .getOne();
  if (!project) throw { status: 404, message: "Project not found" };
  return project;
};

export const updateProject = async (
  userId: string,
  projectId: string,
  data: Partial<Project>,
) => {
  const project = await getProjectById(userId, projectId);
  Object.assign(project, data);
  project.updatedAt = new Date();
  const updated = await projectRepository.save(project);
  return sanitizeProject(updated, "tasks");
};

export const deleteProject = async (userId: string, projectId: string) => {
  const project = await getProjectById(userId, projectId);
  await projectRepository.remove(project);
  return { message: "Project deleted successfully" };
};

export const getProjectsWithCreators = async () => {
  const projects = await projectRepository
    .createQueryBuilder("project")
    .innerJoin("project.user", "user")
    .select(["project.id", "project.title", "project.status", "user.name"])
    .getRawMany();

  return projects.map((row) => ({
    id: row.project_id,
    title: row.project_title,
    status: row.project_status,
    userName: row.user_name,
  }));
};

export const getProjectStatistics = async () => {
  const totalProjects = await projectRepository.count();
  const completedProjects = await projectRepository.count({
    where: { status: "Completed" },
  });
  const activeProjects = await projectRepository.count({
    where: { status: "Active" },
  });

  const percentageCompleted =
    totalProjects === 0 ? 0 : (completedProjects / totalProjects) * 100;

  return {
    totalProjects,
    completedProjects,
    activeProjects,
    percentageCompleted: Number(percentageCompleted.toFixed(2)),
  };
};
