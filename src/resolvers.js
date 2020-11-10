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
      return "list updated";
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
    createTask: async (root, { input, listID }) => {
      let task;
      let db;
      input._id = ObjectID();
      input.completed = false;
      input.creationDate = new Date().toString();
      try {
        db = await connectDB();
        const task = await db
          .collection("lists")
          .updateOne({ _id: ObjectID(listID) }, { $push: { tasks: input } });
      } catch (error) {
        console.log(error);
      }
      return input;
    },
    updateTask: async (root, { input, taskID }) => {
      let task;
      let db;
      const fieldsToUpdate = {};
      Object.keys(input).forEach(
        //To create "task.$.fieldName": fieldValue for each input value
        k => (fieldsToUpdate[`tasks.$.${k}`] = input[k])
      );
      try {
        db = await connectDB();
        const task = await db.collection("lists").updateOne(
          { "tasks._id": ObjectID(taskID) },
          {
            $set: fieldsToUpdate
          }
        );
      } catch (error) {
        console.log(error);
      }
      return "Task Updated";
    },
    deleteTask: async (root, { taskID }) => {
      let task;
      let db;
      try {
        db = await connectDB();
        const task = await db
          .collection("lists")
          .updateOne(
            { "tasks._id": ObjectID(taskID) },
            { $pull: { tasks: { _id: ObjectID(taskID) } } }
          );
      } catch (error) {
        console.log(error);
      }
      return true;
    }
  }
};
