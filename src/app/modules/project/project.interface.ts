export interface ICreateProject {
    name: string;
    description?: string;
}

export interface IUpdateProject {
    name?: string;
    description?: string;
}