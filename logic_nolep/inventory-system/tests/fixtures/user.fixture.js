import bcrypt, { hash } from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { prisma } from '../../prisma/index.ts';

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

export const userOne = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

export const userTwo = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

export const admin = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
};

export const insertUsers = async (users) => {
  const userToInsert = users.map((user) => ({ ...user, password: hashedPassword }));

  await prisma.user.createMany({
    data: userToInsert,
  });
};