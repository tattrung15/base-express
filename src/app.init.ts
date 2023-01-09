import { DataSource } from "typeorm";
import { Config } from "./configs/common";

export const dataSource = new DataSource({
  type: "postgres",
  host: Config.DB_HOST,
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,
  entities: [__dirname + "/entities/*.{js,ts}"],
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
});
