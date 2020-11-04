require("dotenv").config();
const { ObjectID } = require("mongodb");
const { MongoClient } = require("mongodb");
const { DB_URI } = process.env;

let connection;

async function connectDB() {
  if (connection) return connection;

  let client;
  try {
    client = await MongoClient.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    connection = client.db("devacran-productive-list");
  } catch (error) {
    console.error("Could not connect to db", DB_URI, error);
    process.exit(1);
  }

  return connection;
}

const getTask = async () => {
  let db;
  let task;
  try {
    db = await connectDB();
    task = await db
      .collection("lists")
      .find({ "tasks._id": ObjectID("5fa02d93f99a22b08023sbf3") })
      .toArray();
    console.log(task);
  } catch (err) {
    console.log(err);
  }
  return task;
};
// getTask();
console.log(ObjectID());
