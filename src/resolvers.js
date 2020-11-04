const connectDB = require("./db");
const { ObjectID } = require("mongodb");
const prueba = [
  {
    id: 123123,
    name: "Mi Tarea 1",
    duration: 23,
    description: "String",
    completed: false,
    completitionTime: 34,
    startDate: "String",
    endDate: "String",
    creationDate: "String"
  }
];
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
  }
};
