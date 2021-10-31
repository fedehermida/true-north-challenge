const onServerError = () => {
  console.log("Internal Server Error");
};

const onListen = (port) => {
  console.log(`acquisition-ms - Running on Port ${port}`);
};

const onProcessKill = (server) => () => {
  console.log("Service termination signal");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Finishing server");
      return server.close(() => process.exit(0));
    }, 2000).then(resolve());
  });
};

const onException = (error) => {
  console.log({ error });
};

module.exports = {
  onListen,
  onProcessKill,
  onServerError,
  onException,
};
