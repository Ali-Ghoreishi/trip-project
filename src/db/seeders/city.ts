import City from '../models/City';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/connection';

//* Configs
dotenv.config({ path: __dirname + '/../../../.env' });

connectDB();

export const CitySeed = [
  {
    ID: '1',
    name: 'Tehran',
    location: {
      type: 'Point',
      coordinates: [51.389, 35.6895]
    },
    deleted: false
  },
  {
    ID: '2',
    name: 'Isfahan',
    location: {
      type: 'Point',
      coordinates: [51.6676, 32.6546]
    },
    deleted: false
  },
  {
    ID: '3',
    name: 'Shiraz',
    location: {
      type: 'Point',
      coordinates: [52.583698, 29.591768]
    },
    deleted: false
  },
  {
    ID: '4',
    name: 'Ahvaz',
    location: {
      type: 'Point',
      coordinates: [48.67062, 31.318327]
    },
    deleted: false
  }
];

const citySeeder = async () => {
  try {
    // await Service.deleteMany({});
    await City.insertMany(CitySeed);
    console.log('+++ City Seeding was Successful +++');
    disconnectDB();
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

citySeeder();
