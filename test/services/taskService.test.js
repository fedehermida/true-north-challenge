const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const TaskRepository = require("../../src/repository/taskRepository");
const LoremFakerService = require("../../src/services/LoremFakerService");

const TaskService = require("./../../src/services/taskService");

describe("Services", () => {
  beforeEach(() => {
    sinon.restore();
  });
  afterEach(() => {
    sinon.restore();
  });
  describe("Task Service", () => {
    describe("getTaskList method", () => {
      const emptyListFromRepository = new Array();
      const loremFakerTitles = ["maxime dolores veniam"];
      const titleListFromRepository = [
        {
          title: "maxime dolores veniam",
          taskListNumber: 1,
          completed: false,
          UUID: "a4902c25-9398-4fd2-a49c-67b88f69ead3",
        },
      ];
      const fakeRequestNumber = 1;
      const getTaskListResponse = { taskList: titleListFromRepository };
      it("Returns new task list from Lorem-Faker successfully", async function () {
        const getTaskListFromRepositoryMock = sinon.stub(
          TaskRepository,
          "getTaskList"
        );
        const insertTasksMock = sinon.stub(TaskRepository, "insertTasks");
        const loremFakerGetTitlesMock = sinon.stub(
          LoremFakerService,
          "getTitles"
        );

        getTaskListFromRepositoryMock
          .withArgs(fakeRequestNumber)
          .returns(emptyListFromRepository);
        loremFakerGetTitlesMock.withArgs(1).returns({ data: loremFakerTitles });
        insertTasksMock
          .withArgs(loremFakerTitles, fakeRequestNumber)
          .returns(titleListFromRepository);

        const getTasksResult = await TaskService.getTaskList(fakeRequestNumber);

        chai.expect(getTasksResult).to.be.eql(getTaskListResponse);
      });

      it("Returns existent task list from Database successfully", async function () {
        const getTaskListFromRepositoryMock = sinon.stub(
          TaskRepository,
          "getTaskList"
        );
        getTaskListFromRepositoryMock
          .withArgs(fakeRequestNumber)
          .returns(titleListFromRepository);

        const getTasksResult = await TaskService.getTaskList(fakeRequestNumber);

        chai.expect(getTasksResult).to.be.eql(getTaskListResponse);
      });

      it("Throws not found error when Lorem Faker returns no tasks", async function () {
        const getTaskListFromRepositoryMock = sinon.stub(
          TaskRepository,
          "getTaskList"
        );
        const loremFakerGetTitlesMock = sinon.stub(
          LoremFakerService,
          "getTitles"
        );
        getTaskListFromRepositoryMock
          .withArgs(fakeRequestNumber)
          .returns(emptyListFromRepository);
        loremFakerGetTitlesMock.withArgs(1).returns({ data: [] });

        await chai
          .expect(TaskService.getTaskList(fakeRequestNumber))
          .to.be.rejectedWith("Lorem-faker titles not found");
      });
    });
    describe("setTaskCompletion method", () => {
      const taskUUID = "a115e8f9-cb4d-4cc6-b9f5-dd90b08945da";
      const updateCompletionMockResponse = {
        acknowledged: true,
        modifiedCount: 0,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      };
      it("Returns operation status success", async () => {
        const setTaskCompletionFromRepositoryMock = sinon.stub(
          TaskRepository,
          "setTaskCompletion"
        );
        setTaskCompletionFromRepositoryMock
          .withArgs(taskUUID)
          .returns(updateCompletionMockResponse);
        const setTaskCompletionResult = await TaskService.updateTaskCompletion(
          taskUUID
        );
        chai
          .expect(setTaskCompletionResult)
          .to.be.eql(updateCompletionMockResponse);
      });
      it("Throws error conflict: Task has been completed already ", async () => {
        const setTaskCompletionFromRepositoryMock = sinon.stub(
          TaskRepository,
          "setTaskCompletion"
        );
        const taskUUID = "a115e8f9-cb4d-4cc6-b9f5-dd90b08945da";
        setTaskCompletionFromRepositoryMock.withArgs(taskUUID).throws({
          code: 409,
          message: "Task has been completed already",
        });

        await chai
          .expect(TaskService.updateTaskCompletion(taskUUID))
          .to.be.rejectedWith("Task has been completed already");
      });
    });
  });
});
