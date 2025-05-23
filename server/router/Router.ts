import Elysia from "elysia";
import { UserController } from "../controllers/UserController";
import { DataController } from "../controllers/DataController";

export class Router {
  //   static cars = new Elysia().post("/get", (body) => CarController.get);
  static users = new Elysia()
    .post("/signin", (body) => UserController.signin(body))
    .post("/signup", (body) => UserController.signup(body));
  static data = new Elysia().post("/fetch", (body) => DataController.fetch());
}
