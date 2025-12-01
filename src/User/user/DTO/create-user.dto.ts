export class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    currency?: string;
    prof_pic?: string;
    salary?: number;
}
