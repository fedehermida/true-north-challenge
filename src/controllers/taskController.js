const TaskService = require("../services/taskService");

const assert = require("assert");
const _ = require("lodash");
const httpError = require("http-errors");

const getTasks = async (req, res, next) => {
  try {
    const numberOfTasks =
      req.query.numberOfTasks === undefined
        ? 3
        : parseInt(req.query.numberOfTasks);
    assert(
      _.isInteger(
        numberOfTasks,
        httpError.BadRequest("Number of tasks must be a number")
      )
    );
    const tasks = await TaskService.getTaskList(numberOfTasks);
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const updateTaskCompletion = async (req, res, next) => {
  try {
    const { taskUUID } = req.body;
    const taskStatusUpdate = await TaskService.updateTaskCompletion(taskUUID);
    return res.status(200).json(taskStatusUpdate);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  updateTaskCompletion,
};
