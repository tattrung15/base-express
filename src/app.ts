import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "reflect-metadata";
import routes from "./routes/index";
import LogHelper from "./helpers/log.helper";
import { AppError, ManagedError } from "./models";
import { handleAppError, handleError } from "./middlewares/error.middleware";
import { Config } from "./configs/common";
import { Server } from "socket.io";
import sockets from "./socket/index.socket";
import { initPostgresConnection } from "./app.init";

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
    await initPostgresConnection();
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

  const server = app.listen(Config.APP_PORT, () => {
    LogHelper.logInfo(
      "App listening on",
      `http://localhost:${Config.APP_PORT}`,
    );
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: "*",
    },
  });

  io.on("connection", (socket) => {
    LogHelper.logInfo("SOCKET", "Socket connect", socket.id);
    for (let i = 0; i < sockets.length; i++) {
      const s = sockets[i];
      socket.on(s.event, (data) => s.handler(socket, data));
      socket.on("disconnect", () => {
        LogHelper.logInfo("SOCKET", "Socket disconnect", socket.id);
        socket.removeAllListeners();
      });
    }
  });

  process.on("SIGTERM", () => {
    LogHelper.logInfo("SIGTERM signal received: closing HTTP server");
    io.close(() => {
      LogHelper.logInfo("SOCKET", "Shutdown socket server");
    });
    server.close(() => {
      LogHelper.logInfo("HTTP server closed");
    });
  });
});
