const connectDB = require("./db");
const { ObjectID } = require("mongodb");

module.exports = {
  Query: {
    getList: async (root, { listID }) => {
      let db;
      let list;
      try {
        db = await connectDB();
        list = await db.collection("lists").findOne({
          _id: ObjectID(listID)
        });
      } catch (err) {
        console.log(err);
      }
      return list;
    },
    getTask: async (root, { taskID }) => {
      let db;
      let task;
      try {
        db = await connectDB();
        const list = await db
          .collection("lists")
          .findOne({ "tasks._id": ObjectID(taskID) });
        task = list.tasks.shift();
      } catch (err) {
        console.log(err);
      }
      return task;
    }
  },
  Mutation: {
    createList: async (root, { input }) => {
      let list;
      let db;
      try {
        db = await connectDB();
        const list = await db.collection("lists").insertOne(input);
        input._id = list.insertedId;
      } catch (error) {
        console.log(error);
      }
      return input;
    },
    updateList: async (root, { input, listID }) => {
      let db;
      let list;
      const { _id, ...inputData } = input;
      try {
        db = await connectDB();
        list = await db
          .collection("lists")
          .updateOne({ _id: ObjectID(listID) }, { $set: inputData });
        input._id = list.upsertedId;
      } catch (error) {
        console.log(error);
      }
      return input;
    },
    deleteList: async (root, { input }) => {
      let db;
      try {
        db = await connectDB();
        const list = await db
          .collection("lists")
          .deleteOne({ _id: ObjectID(input) });
      } catch (error) {
        console.log(error);
      }
      return true;
    },
    createTask: (root, { task }) => {
      console.log("createTask", task);
      return null;
    },
    updateTask: (root, { task }) => {
      console.log("updateTask", task);
      return null;
    },
    deleteTask: (root, { task }) => {
      console.log("deleteTask", task);
      return null;
    }
  }
};
