import User from '../models/User';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/connection';

//* Configs
dotenv.config({ path: __dirname + '/../../../.env' });

connectDB();

export const UserSeed = [
  {
    _id: '65acf303e53d5a05f0789db9',
    ID: '1',
    username: 'admin1',
    password: '$2b$10$xPA/Wx17aYXp/eT0Msq6ieDg2D6fZurY7Tx97QpCmfBRU3LhdjmVS', // 11111111
    fullname: 'aliGhoreishi',
    email: 'admin@gmail.com',
    mobile: '09134437233',
    address: 'iran-tehran',
    role: 'Admin',
    status: 'active'
  }
];

const userSeeder = async () => {
  try {
    // await User.deleteMany({});
    await User.insertMany(UserSeed);
    console.log('+++ User Seeding was Successful +++');
    disconnectDB();
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

userSeeder();
