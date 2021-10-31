const sessionMock = {
  startTransaction: () => true,
  commitTransaction: () => true,
  abortTransaction: () => true,
};

const defaultRequestNumber = 3;

const matchExpression = {
  $match: { taskListNumber: defaultRequestNumber },
};

const projectExpression = {
  $project: {
    _id: 0,
    UUID: "$_id",
    title: 1,
    taskListNumber: 1,
    completed: 1,
  },
};
const tasksNotFound = new Array();
const loremFakeResponse = {
  data: [
    "saepe consequuntur quia",
    "rerum totam voluptate",
    "vero eum accusamus",
  ],
};

const titleMock1 = [
  {
    title: "saepe consequuntur quia",
    taskListNumber: 3,
  },
];

const titleInsertedMock1 = [
  {
    _doc: {
      title: "saepe consequuntur quia",
      taskListNumber: 3,
      completed: false,
      _id: "af86cae5-6cb7-42e7-b2b4-4dca1029c569",
    },
  },
];
const titleMock2 = [
  {
    title: "rerum totam voluptate",
    taskListNumber: 3,
  },
];

const titleInsertedMock2 = [
  {
    _doc: {
      title: "rerum totam voluptate",
      taskListNumber: 3,
      completed: false,
      _id: "2d9dc314-a29e-428f-98a7-9fdc9bae355d",
    },
  },
];

const titleMock3 = [
  {
    title: "vero eum accusamus",
    taskListNumber: 3,
  },
];

const titleInsertedMock3 = [
  {
    _doc: {
      title: "vero eum accusamus",
      taskListNumber: 3,
      completed: false,
      _id: "3f2e6488-1074-4a98-b40f-43fca452b19d",
    },
  },
];

const loremFakerDefaultUrl = `https://lorem-faker.vercel.app/api?quantity=${defaultRequestNumber}`;
const loremFakerDefinedUrl = `https://lorem-faker.vercel.app/api?quantity=1`;

const insertedTaskListResponse = {
  taskList: [
    {
      title: "saepe consequuntur quia",
      taskListNumber: 3,
      completed: false,
      UUID: "af86cae5-6cb7-42e7-b2b4-4dca1029c569",
    },
    {
      title: "rerum totam voluptate",
      taskListNumber: 3,
      completed: false,
      UUID: "2d9dc314-a29e-428f-98a7-9fdc9bae355d",
    },
    {
      title: "vero eum accusamus",
      taskListNumber: 3,
      completed: false,
      UUID: "3f2e6488-1074-4a98-b40f-43fca452b19d",
    },
  ],
};

/* Tasks from MongoDB */

const taskListFromRepository = [
  {
    title: "modi ut omnis",
    taskListNumber: 1,
    completed: false,
    UUID: "b3c56027-3bab-4d04-a969-564389b9c564",
  },
];

const taskListResponseFromRepository = {
  taskList: [
    {
      title: "modi ut omnis",
      taskListNumber: 1,
      completed: false,
      UUID: "b3c56027-3bab-4d04-a969-564389b9c564",
    },
  ],
};

const matchExpressionDefinedByUser = {
  $match: { taskListNumber: 1 },
};

const UUID = {
  _id: "b3c56027-3bab-4d04-a969-564389b9c564",
};

const setOperation = {
  $set: { completed: true },
};

const updateOperationSuccessful = {
  acknowledged: true,
  modifiedCount: 1,
  upsertedId: null,
  upsertedCount: 0,
  matchedCount: 1,
};

const updateOperationError = {
  acknowledged: true,
  modifiedCount: 0,
  upsertedId: null,
  upsertedCount: 0,
  matchedCount: 1,
};

module.exports = {
  sessionMock: sessionMock,
  defaultRequestNumber: defaultRequestNumber,
  matchExpression: matchExpression,
  projectExpression: projectExpression,
  tasksNotFound: tasksNotFound,
  loremFakeResponse: loremFakeResponse,
  titleMock1: titleMock1,
  titleInsertedMock1: titleInsertedMock1,
  titleMock2: titleMock2,
  titleInsertedMock2: titleInsertedMock2,
  titleMock3: titleMock3,
  titleInsertedMock3: titleInsertedMock3,
  taskListResponse: insertedTaskListResponse,
  loremFakerDefaultUrl: loremFakerDefaultUrl,
  taskListFromRepository: taskListFromRepository,
  taskListResponseFromRepository: taskListResponseFromRepository,
  loremFakerDefinedUrl: loremFakerDefinedUrl,
  matchExpressionDefinedByUser: matchExpressionDefinedByUser,
  UUID: UUID,
  updateOperationSuccessful: updateOperationSuccessful,
  setOperation: setOperation,
  updateOperationError: updateOperationError
};
