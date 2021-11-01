const LoremFakerService = require("./loremFakerService");
const TaskRepository = require("./../repository/taskRepository");
const createHttpError = require("http-errors");

class TaskService {
  static async getTaskList(taskListNumber) {
    try {
      let taskList = await TaskRepository.getTaskList(taskListNumber);
      if (taskList.length) return { taskList };

      const { data: titles } = await LoremFakerService.getTitles(
        taskListNumber
      );
      if (!titles.length)
        throw createHttpError.NotFound("Lorem-faker titles not found");

      taskList = await TaskRepository.insertTasks(titles, taskListNumber);
      return { taskList };
    } catch (err) {
      throw err;
    }
  }
  static async updateTaskCompletion(taskUUID) {
    try {
      return await TaskRepository.setTaskCompletion(taskUUID);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TaskService;
