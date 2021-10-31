const chai = require("chai");
const sandbox = require('sinon').createSandbox()
const { mockReq, mockRes } = require("sinon-express-mock");
const {
  getTasks,
  updateTaskCompletion,
} = require("./../../src/controllers/taskController");
const TaskService = require("./../../src/services/taskService");

describe("Controllers", () => {
  beforeEach(() => {
    sandbox.restore();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe("Task Controllers", () => {
    describe("getTasks Controller", () => {
      it("Returns Status ok", async () => {
        const mockGetTaskList = sandbox.stub(TaskService, "getTaskList");
        const next = sandbox.stub();

        const taskServiceResponse = {
          taskList: [
            {
              title: "enim officiis ratione",
              taskListNumber: 2,
              completed: false,
              UUID: "4973611c-3c33-4048-8ba2-be0b7f0e7271",
            },
            {
              title: "fuga adipisci non",
              taskListNumber: 2,
              completed: false,
              UUID: "a115e8f9-cb4d-4cc6-b9f5-dd90b08945da",
            },
          ],
        };
        mockGetTaskList.withArgs(2).returns(taskServiceResponse);

        const req = mockReq({
          query: {
            numberOfTasks: "2",
          },
        });

        const res = mockRes();
        const getTasksResult = await getTasks(req, res, next);
        chai.expect(getTasksResult.status.firstCall.args[0]).to.be.eql(200);
        chai
          .expect(getTasksResult.json.firstCall.args[0])
          .to.equal(taskServiceResponse);
      });

      it("Invalid numberOfTasks query param throws Bad Request", async () => {
        
        const req = mockReq({
          query: {
            numberOfTasks: "invalidType",
          },
        });

        const res = mockRes();

        chai.expect(
          async () => await getTasks(req, res, next).to.throw("Bad Request")
        );
      });

      it("Next function gets called when TaskService fails", async () => {
        const mockGetTaskList = sandbox.stub(TaskService, "getTaskList");
        const next = sandbox.stub();

        const req = mockReq({
          query: {
            numberOfTasks: "4",
          },
        });

        const res = mockRes();
        mockGetTaskList.withArgs(4).throws({
          code: 503,
          status: "ServiceUnavailable",
        });
        await getTasks(req, res, next);
        chai.expect(next.firstCall.args[0].code).to.be.equal(503);
        chai
          .expect(next.firstCall.args[0].status)
          .to.be.equal("ServiceUnavailable");
      });
    });
    describe("updateTaskCompletion Controller", () => {
      
      const taskUUID = "a115e8f9-cb4d-4cc6-b9f5-dd90b08945da";
      it("Returns Status Ok", async () => {
        const mockUpdateTaskCompletion = sandbox.stub(
          TaskService,
          "updateTaskCompletion"
        );
        const next = sandbox.stub();

        const updateCompletionMockResponse = {
          acknowledged: true,
          modifiedCount: 1,
          upsertedId: null,
          upsertedCount: 0,
          matchedCount: 1,
        };
        const req = mockReq({
          body: {
            taskUUID: taskUUID,
          },
        });

        const res = mockRes();

        mockUpdateTaskCompletion
          .withArgs(taskUUID)
          .returns(updateCompletionMockResponse);

        const updateTaskCompletionResult = await updateTaskCompletion(
          req,
          res,
          next
        );
        chai
          .expect(updateTaskCompletionResult.status.firstCall.args[0])
          .to.be.eql(200);
        chai
          .expect(updateTaskCompletionResult.json.firstCall.args[0])
          .to.equal(updateCompletionMockResponse);
      });
      it("Next function gets called when TaskService updateTaskCompletion fails", async () => {
        const mockUpdateTaskCompletion = sandbox.stub(
          TaskService,
          "updateTaskCompletion"
        );
        const next = sandbox.stub();

        const req = mockReq({
          body: {
            taskUUID: taskUUID,
          },
        });

        const res = mockRes();
        mockUpdateTaskCompletion.withArgs(taskUUID).throws({
          code: 409,
          status: "Conflict",
          message: "The task has already been completed",
        });

        await updateTaskCompletion(req, res, next);
        chai.expect(next.firstCall.args[0].code).to.be.equal(409);
        chai.expect(next.firstCall.args[0].status).to.be.equal("Conflict");
        chai
          .expect(next.firstCall.args[0].message)
          .to.be.equal("The task has already been completed");
      });
    });
  });
});
