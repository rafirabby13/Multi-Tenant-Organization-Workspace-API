import { TaskStatus } from "../../../../prisma/generated/prisma/enums";

export interface ICreateTask {
    title: string;
    description?: string;
    projectId: string;
    assigneeId?: string; 
    dueDate?: string;    
}

export interface IUpdateTask {
    title?: string;
    description?: string;
    status?: TaskStatus;
    assigneeId?: string;
    dueDate?: string;
}