export interface IreturnUser {
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
  accessToken: string;
}

export interface IreturnTwitUser {
  id: number | string;
  nick: string;
  name: string;
  accessToken: string;
}
export interface ILogin {
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
}
export interface ILoginBase {
  user_id: string;
  name: string;
  surname: string;
  email: string;
  avatar_url: string;
}

export interface ILoginPhone {
  username: string;
  phone: string;
  user_id: string;
}

export interface IReturnLogin {
  id: number;
  first_name: string;
  second_name: string;
  email: string;
  phone: string;
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
  email: string;
  avatar: string;
  header: string;
  description: string;
  plan: string;
  plan_end_date: Date;
  is_blocked: boolean;
}
