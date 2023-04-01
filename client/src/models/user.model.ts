export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserRequest extends Omit<User, 'id'> {
  password: string;
}

export interface UserResponse extends User {
  token: string;
}