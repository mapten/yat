// Models
import { User } from '../../models/user.model';

// Constants
import { USER_TABLE } from '../../constants/dbTables.constants';

// DB
import { getDb } from '../connector';

export const getUserByEmail = async (userEmail: string) => {
  return getDb().collection<User>(USER_TABLE).findOne({ email: userEmail });
}

export const signin = async (id: string, userEmail: string, hashedPassword: string, userName: string, createdAt: string) => {
  if (await getDb().collection<User>(USER_TABLE).findOne({ email: userEmail })) {
    return false;
  }

  return await getDb().collection<User>(USER_TABLE)
    .insertOne({
      id,
      email: userEmail,
      password: hashedPassword,
      name: userName,
      createdAt
    }).then((user) => {
      return user.acknowledged;
    }).catch((error) => {
      console.log(error);
      return false;
    });
}