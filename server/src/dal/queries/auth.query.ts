// Models
import { User } from '../../models/user.model';
import { EncryptedUser } from '../../models/encryptedUser.model';

// Constants
import { USER_TABLE } from '../../constants/dbTables.constants';

// DB
import { getDb } from '../connector';

// Services
import { mongoDbEncrypt } from '../../services/mongodb.encrypt';

// Queries
import { getKeyVaultKey } from './keyvault.query';

export const getUserByEmail = async (email: string) => {
  const keyVaultKey = await getKeyVaultKey();
  const encryptedEmail = await mongoDbEncrypt(email, keyVaultKey);

  return getDb().collection<User>(USER_TABLE).findOne({ email: encryptedEmail });
}

export const signin = async (id: string, email: string, hashedPassword: string, userName: string, createdAt: string) => {
  const keyVaultKey = await getKeyVaultKey();

  const encryptedEmail = await mongoDbEncrypt(email, keyVaultKey);

  if (await getDb().collection<User>(USER_TABLE).findOne({ email: encryptedEmail })) {
    return false;
  }

  const encryptedPassword = await mongoDbEncrypt(hashedPassword, keyVaultKey);
  const encryptedName = await mongoDbEncrypt(userName, keyVaultKey);

  return await getDb().collection<EncryptedUser>(USER_TABLE)
    .insertOne({
      id,
      email: encryptedEmail,
      password: encryptedPassword,
      name: encryptedName,
      createdAt
    }).then((user) => {
      return user.acknowledged;
    }).catch((error) => {
      console.log(error);
      return false;
    });
}