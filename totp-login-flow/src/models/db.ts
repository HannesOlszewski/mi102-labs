import mongoose from 'mongoose';

const DATABASE_URL = 'mongodb://localhost:27017/topt-flow';
export const connectDb = () => {
  return mongoose
    .connect(DATABASE_URL)
    .then((mong) => {
      console.log('Successfully connect to MongoDB.');
      mong.connection.db.dropDatabase((err, res) => {
        if (res) console.log('Successfully dropped table');
      });
    })
    .catch((err) => {
      console.error('Connection error', err);
      process.exit();
    });
};
