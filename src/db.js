require("dotenv").config();

const { MongoClient } = require("mongodb");
const { DB_URI, DB_NAME, TEST_DB_NAME, NODE_ENV } = process.env;

let connection;

async function connectDB() {
  if (connection) return connection;

  let client;
  try {
    client = await MongoClient.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    connection = client.db(NODE_ENV === "development" ? TEST_DB_NAME : DB_NAME);
  } catch (error) {
    console.error("Could not connect to db", DB_URI, error);
    process.exit(1);
  }

  return connection;
}

module.exports = connectDB;
