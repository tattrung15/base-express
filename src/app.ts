import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "reflect-metadata";
import routes from "./routes/index";
import LogHelper from "./helpers/log.helper";
import { AppError, ManagedError } from "./models";
import { handleAppError, handleError } from "./middlewares/error.middleware";
import { Config } from "./configs/common";
import { dataSource } from "./database.init";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);
app.use(
  (
    instance: ManagedError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ) => {
    const { error } = instance;
    if (error instanceof AppError) {
      handleAppError(req, res)(error);
    } else {
      handleError(req, res)(error);
    }
  },
);

setImmediate(async () => {
  try {
    await dataSource.initialize();
    LogHelper.logInfo("Database connected");
  } catch (dbConnectError) {
    let errorMsg = "";
    if (typeof dbConnectError === "string") {
      errorMsg = dbConnectError;
    } else if (dbConnectError && typeof dbConnectError === "object") {
      errorMsg = dbConnectError.toString();
    }
    LogHelper.logError("First start failed to connect to DB", errorMsg);
  }

  app.listen(Config.APP_PORT, () => {
    LogHelper.logInfo(
      "App listening on",
      `http://localhost:${Config.APP_PORT}`,
    );
  });
});
