export enum Role {
    ADMIN = "admin",
    STUDENT = "student",
    TEACHER = "teacher",
}


export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    other?: any;
}
