export interface IReturnList {
  id: number;
  first_name: string;
  second_name: string;
  email: string;
  avatar: string;
  header: string;
  description: string;
  plan: string;
  plan_end_date: Date;
  is_blocked: boolean;
}
export interface IReturnUser {
  id: number;
  first_name: string;
  second_name: string;
  phone: string;
  email: string;
  avatar: string | null;
  header: string;
  description: string;
  plan: string;
  plan_end_date: Date;
  is_blocked: boolean;
}
export interface ICreateUserDTO {
  first_name?: string;
  second_name?: string;
  email?: string | null;
  user_id?: string;
  avatar?: string | null;
  username?: string | null;
  phone?: string | null;
}
