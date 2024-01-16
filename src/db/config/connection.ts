import mongoose, { ConnectOptions } from 'mongoose';

import Helper from '../../components/helper';

const connectDB = async () => {
  try {
    let conn: typeof mongoose;
    // const connectionOptions: ConnectOptions = {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    // };
    const uri = Helper.GetDatabaseURI(); 
    if (uri) {
      conn = await mongoose.connect(`${uri}${process.env.DB_NAME}` /*, connectionOptions*/);
    } else {
      console.error("Invalid NODE_ENV value. Set NODE_ENV to 'developmentDocker' or 'development' or 'production'.");
      process.exit(1);
    }

    console.log(`{ MongoDB Connected: ${conn.connection.host + ' , ' + conn.connection.name} }`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const disconnectDB = () => {
  mongoose.connection.close();
  console.log('Database Disconnected');
};

export { connectDB, disconnectDB };
