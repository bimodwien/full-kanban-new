'use strict';

import { Request } from 'express';
import prisma from '@/prisma';
import { TUser } from '@/models/user.model';
import { hashPassword, comparePassword } from '@/libraries/bcrypt';
import { createToken } from '@/libraries/jwt';
import { Prisma } from '@prisma/client';

class UserService {
  static async register(req: Request) {
    const { username, password, email, fullName } = req.body as TUser;
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    if (existingUser) {
      throw new Error('User already exist!');
    }
    const hashed = await hashPassword(String(password));
    const data: Prisma.UserCreateInput = {
      username,
      email,
      fullName,
      password: hashed,
    };
    const newUser = await prisma.user.create({ data });
    return newUser;
  }

  static async login(req: Request) {
    const { username, password } = req.body as TUser;
    const user = (await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        password: true,
      },
    })) as TUser;
    if (!user) {
      throw new Error('User not found!');
    }
    const isPasswordValid = await comparePassword(
      String(user.password),
      String(password),
    );
    if (!isPasswordValid) {
      throw new Error('Invalid Password');
    }
    delete user.password;
    const access_token = createToken({ user, type: 'access_token' }, '1d');
    const refresh_token = createToken({ user, type: 'refresh_token' }, '7d');
    return { access_token, refresh_token };
  }

  static async findAllUser(req: Request) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
      },
    });
    return users;
  }
}

export default UserService;
