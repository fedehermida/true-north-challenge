const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const sinon = require("sinon");
const axios = require("axios");
const Task = require("./../../src/models/taskModel");
const tasksResponses = require("./configStubs/tasksMocks");

const server = require("./../../src/app");

describe("Integration", () => {
  beforeEach(() => {
    sinon.restore();
  });
  describe("GET /tasks route", () => {
    it("Fetch tasks from Lorem-fake with status code 200 using default request order number tasks", () => {
      const mongoAggregateMock = sinon.stub(Task, "aggregate");
      const axiosLoremFakeMock = sinon.stub(axios, "get");

      const mongoSessionMock = sinon
        .stub(Task, "startSession")
        .withArgs()
        .returns(tasksResponses.sessionMock);
      const mongoCreateMock = sinon.stub(Task, "create");

      mongoAggregateMock
        .withArgs([
          tasksResponses.matchExpression,
          tasksResponses.projectExpression,
        ])
        .returns(tasksResponses.tasksNotFound);

      axiosLoremFakeMock
        .withArgs(tasksResponses.loremFakerDefaultUrl)
        .returns(tasksResponses.loremFakeResponse);
      mongoCreateMock
        .withArgs(tasksResponses.titleMock1, tasksResponses.sessionMock)
        .returns(tasksResponses.titleInsertedMock1);
      mongoCreateMock
        .withArgs(tasksResponses.titleMock2, tasksResponses.sessionMock)
        .returns(tasksResponses.titleInsertedMock2);
      mongoCreateMock
        .withArgs(tasksResponses.titleMock3, tasksResponses.sessionMock)
        .returns(tasksResponses.titleInsertedMock3);

      chai
        .request(server)
        .get("/tasks")
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.eql(tasksResponses.taskListResponse);
        });
    });
    it("Fetch tasks from Database repository with status code 200 using the first request order", () => {
      const mongoAggregateMock = sinon.stub(Task, "aggregate");

      mongoAggregateMock
        .withArgs([
          tasksResponses.matchExpressionDefinedByUser,
          tasksResponses.projectExpression,
        ])
        .returns(tasksResponses.taskListFromRepository);

      chai
        .request(server)
        .get("/tasks?numberOfTasks=1")
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai
            .expect(res.body)
            .to.eql(tasksResponses.taskListResponseFromRepository);
        });
    });

    it("Unable to fetch tasks from Database repository: throws 503 error and rollbacks transaction", () => {
      const mongoAggregateMock = sinon.stub(Task, "aggregate");
      const axiosLoremFakeMock = sinon.stub(axios, "get");

      const mongoSessionMock = sinon
        .stub(Task, "startSession")
        .withArgs()
        .returns(tasksResponses.sessionMock);
      const mongoCreateMock = sinon.stub(Task, "create");

      mongoAggregateMock
        .withArgs([
          tasksResponses.matchExpression,
          tasksResponses.projectExpression,
        ])
        .returns(tasksResponses.tasksNotFound);

      axiosLoremFakeMock
        .withArgs(tasksResponses.loremFakerDefaultUrl)
        .returns(tasksResponses.loremFakeResponse);
      mongoCreateMock
        .withArgs(tasksResponses.titleMock1, tasksResponses.sessionMock)
        .throws({ message: { message: { error: "Service Unavailable" } } });

      chai
        .request(server)
        .get("/tasks")
        .end((err, res) => {
          chai.expect(res).to.have.status(503);
          // chai.expect(res.body).to.eql({ error: "Service Unavailable" });
        });
    });
  });

  describe("PUT /tasks route", () => {
    it("Set required task as completed", () => {
      const mongoUpdateOneMock = sinon.stub(Task, "updateOne");
      mongoUpdateOneMock
        .withArgs(tasksResponses.UUID, tasksResponses.setOperation)
        .returns(tasksResponses.updateOperationSuccessful);

      chai
        .request(server)
        .put("/tasks")
        .send({
          taskUUID: tasksResponses.UUID._id,
        })
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai
            .expect(res.body)
            .to.eql(tasksResponses.updateOperationSuccessful);
        });
    });

    it("Task has already been completed, throws status error 409", () => {
      const mongoUpdateOneMock = sinon.stub(Task, "updateOne");
      mongoUpdateOneMock
        .withArgs(tasksResponses.UUID, tasksResponses.setOperation)
        .returns(tasksResponses.updateOperationConflict);

      chai
        .request(server)
        .put("/tasks")
        .send({
          taskUUID: tasksResponses.UUID._id,
        })
        .end((err, res) => {
          chai.expect(res.status).to.eql(409);
          chai
            .expect(res.body)
            .to.eql({ message: "Task has been completed already" });
        });
    });

    it("Task not found, throws status error 404", () => {
      const mongoUpdateOneMock = sinon.stub(Task, "updateOne");
      mongoUpdateOneMock
        .withArgs(tasksResponses.UUID, tasksResponses.setOperation)
        .returns(tasksResponses.updateOperationNotFound);

      chai
        .request(server)
        .put("/tasks")
        .send({
          taskUUID: tasksResponses.UUID._id,
        })
        .end((err, res) => {
          chai.expect(res.status).to.eql(404);
          chai
            .expect(res.body)
            .to.eql({ message: "Task not found" });
        });
    });
  });
});
