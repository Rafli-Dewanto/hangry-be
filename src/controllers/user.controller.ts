import { User } from '../models/user.model';

// data dummy user
let users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@email.com',
    dob: '1989-05-17',
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@email.com',
    dob: '2001-12-01',
  }
];

export const getUsers = (): User[] => users;

export const getUserById = (userId: number): User | undefined =>
  users.find((user) => user.id === userId);

export const createUser = (user: User): void => {
  users.push(user);
};

export const updateUser = (userId: number, updatedUser: User): User | undefined => {
  const index = users.findIndex((user) => user.id === userId);

  const userFound = index !== -1;
  if (userFound) {
    // update user berdasarkan payload yang dikirim
    users[index] = { ...users[index], ...updatedUser };
    return users[index];
  }

  return undefined;
};

export const deleteUser = (userId: number): User | undefined => {
  const index = users.findIndex((user) => user.id === userId);

  if (index !== -1) {
    const deletedUser = users.splice(index, 1)[0];
    return deletedUser;
  }

  return undefined;
};
