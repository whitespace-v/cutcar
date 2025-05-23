import { Pool } from "../utils/Pool";
import bcrypt from "bcrypt";
import { Tokenizer } from "../utils/Tokenizer";
import { Responder } from "../utils/Responder";

export class UserController {
  static async signin({ login, pwd }: { login: string; pwd: string }) {
    try {
      const user = await Pool.conn.user.findUnique({
        where: { login },
      });
      if (user) {
        if (bcrypt.compareSync(pwd, user.password)) {
          Responder.ok({
            token: Tokenizer.generate(user),
          });
        } else {
          return Responder.forbidden("Некорректные данные");
        }
      } else {
        return Responder.forbidden("Некорректные данные");
      }
    } catch (e) {
      console.log(e);
      return Responder.internal();
    }
  }
  static async signup({
    login,
    pwd,
    secret_key,
  }: {
    secret_key: string;
    login: string;
    pwd: string;
  }) {
    try {
      if (secret_key !== "205002")
        return Responder.forbidden("Некорректные данные");

      const candidate = await Pool.conn.user.findUnique({
        where: { login },
      });

      if (candidate) {
        return Responder.forbidden("Логин занят");
      } else {
        const user = await Pool.conn.user.create({
          data: {
            login,
            password: await bcrypt.hash(pwd, 15),
          },
        });
        return Responder.ok({
          token: Tokenizer.generate(user),
        });
      }
    } catch (e) {
      console.log(e);
      return Responder.internal();
    }
  }
}
