import Service from '../models/Service';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/connection';

//* Configs
dotenv.config({ path: __dirname + '/../../../.env' });

connectDB();

export const ServiceSeed = [
  {
    ID: '1',
    name: 'Ride',
    capacity: 4,
    deleted: false
  },
  {
    ID: '2',
    name: 'Bus',
    capacity: 20,
    deleted: false
  },
  {
    ID: '3',
    name: 'Van',
    capacity: 10,
    deleted: false
  }
];

const serviceSeeder = async () => {
  try {
    // await Service.deleteMany({});
    await Service.insertMany(ServiceSeed);
    console.log('+++ Service Seeding was Successful +++');
    disconnectDB();
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

serviceSeeder();
