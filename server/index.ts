// https://baz-on.ru/export/c3063/4da8e/cutcar-drom.csv
import dotenv from "dotenv";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { Console } from "./utils/Console";
import { Router } from "./router/Router";

class API {
  constructor() {
    dotenv.config();
    this.useMiddlewares();
    this.useRoutes();
    this.init().then(async () => {
      Console.log(
        "magenta",
        `[API]: Server is running at :${process.env.PORT}`
      );
    });
  }
  private app = new Elysia();

  private useMiddlewares() {
    this.app.use(cors());
  }
  private useRoutes() {
    this.app.group("/data", (app) => app.use(Router.data));
    this.app.group("/users", (app) => app.use(Router.users));
  }
  async init() {
    this.app.listen(process.env.PORT || 5000);
  }
}

new API();
