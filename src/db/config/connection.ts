import mongoose, { ConnectOptions } from 'mongoose';

const connectDB = async () => {
  try {
    let conn: typeof mongoose;
    // const connectionOptions: ConnectOptions = {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    // };
    if (process.env.NODE_ENV === 'development') {
       conn = await mongoose.connect(`${process.env.MONGO_URI_LOCAL}${process.env.DB_NAME}`/*, connectionOptions*/);
    } else if (process.env.NODE_ENV === 'production') {
      conn = await mongoose.connect(`${process.env.MONGO_URI_SERVER}${process.env.DB_NAME}`/*, connectionOptions*/);
    } else {
      console.error("Invalid NODE_ENV value. Set NODE_ENV to 'development' or 'production'.");
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
