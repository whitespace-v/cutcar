import Elysia, { t } from "elysia";
import { UserController } from "../controllers/UserController";
import { DataController } from "../controllers/DataController";

export class Router {
  //   static cars = new Elysia().post("/get", (body) => CarController.get);
  static users = new Elysia()
    .post(
      "/signin",
      ({ body: { login, password } }) =>
        UserController.signin({ login, password }),
      {
        body: t.Object({
          login: t.String(),
          password: t.String(),
        }),
      }
    )
    .post(
      "/signup",
      ({ body: { login, password, key } }) =>
        UserController.signup({ login, password, key }),
      {
        body: t.Object({
          login: t.String(),
          password: t.String(),
          key: t.String(),
        }),
      }
    );
  static data = new Elysia()
    .post("/fetch", () => DataController.fetch())
    .get(
      "/collect",
      ({ query: { limit, offset, status, query, column, direction } }) =>
        DataController.collect({
          limit,
          offset,
          status,
          query,
          column,
          direction,
        }),
      {
        query: t.Object({
          limit: t.String(),
          offset: t.String(),
          status: t.String(),
          query: t.String(),
          column: t.String(),
          direction: t.String(),
        }),
      }
    );
}
