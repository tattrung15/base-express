import { createConnection } from "typeorm";
import { Config } from "./configs/common";

const initPostgresConnection = async () => {
  const connection = await createConnection({
    type: "postgres",
    host: Config.DB_HOST,
    port: Config.DB_PORT,
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    entities: [__dirname + "/entities/*.{js,ts}"],
    migrations: [__dirname + "/migrations/*{.ts,.js}"],
  });
  return connection;
};

export { initPostgresConnection };
