// 用户相关类型
import { UserStatus } from '@blueunion/database';

export interface UserDTO {
  id: string;
  username: string;
  email?: string;
  nickname?: string;
  avatar?: string;
  status: UserStatus;
  roleId: string;
  role?: {
    id: string;
    name: string;
    code: string;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface CreateUserInput {
  username: string;
  password: string;
  email?: string;
  nickname?: string;
  roleId: string;
}

export interface UpdateUserInput {
  email?: string;
  nickname?: string;
  avatar?: string;
  status?: UserStatus;
  roleId?: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserDTO;
}
