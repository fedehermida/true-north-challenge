const createHttpError = require("http-errors");
const Task = require("./../models/taskModel");

class TaskRepository {
  static async getTaskList(taskListNumber) {
    try {
      const taskList = await Task.aggregate([
        {
          $match: { taskListNumber },
        },
        {
          $project: {
            _id: 0,
            UUID: "$_id",
            title: 1,
            taskListNumber: 1,
            completed: 1,
          },
        },
      ]);
      return taskList;
    } catch (error) {
      throw createHttpError.ServiceUnavailable(error);
    }
  }

  static async _createTask(task, transaction) {
    try {
      const [{ _doc}] = await Task.create([task], transaction);
      const {title, taskListNumber, completed, _id } = _doc
      return { title, taskListNumber, completed, UUID: _id };
    } catch (error) {
      throw createHttpError.ServiceUnavailable(error);
    }
  }

  static async insertTasks(titles, taskListNumber){
      const session = await Task.startSession()
      session.startTransaction()
      try{
        const taskList = new Array();
        for (let title of titles) {
          let taskCreated = await this._createTask({ title, taskListNumber }, session);
          taskList.push(taskCreated);
        }
        session.commitTransaction();
        return taskList;
      }
      catch (error){
          session.abortTransaction();
          throw createHttpError.ServiceUnavailable(error);
      }
  }

  static async setTaskCompletion(taskUUID) {
    try {
      const taskCompletionStatus = await Task.updateOne(
        { _id: taskUUID },
        { $set: { completed: true } }
      );
      if(!taskCompletionStatus.modifiedCount){
        throw createHttpError.Conflict('Task has been completed already')
      }
      return taskCompletionStatus;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TaskRepository;
