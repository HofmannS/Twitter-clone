import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Add MONGODB_URI to .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

export default connectDB;

//Упрощённая логика всего файла:

// если уже подключены:
//     вернуть подключение

// если подключение ещё создаётся:
//     ждать его

// если подключения нет:
//     создать подключение

// вернуть подключение