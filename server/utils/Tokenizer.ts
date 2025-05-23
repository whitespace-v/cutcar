import jsonwebtoken from "jsonwebtoken";
import type { IUser } from "../models/types";

export class Tokenizer {
  private static readonly secret_key =
    " 8 musdfdd 56)_@#9- 109 798f7*&R^4{{}} ^&  po3duf6o9 0   ";
  static generate(user: IUser) {
    return jsonwebtoken.sign(
      {
        login: user.login,
        password: user.password,
      },
      this.secret_key,
      { expiresIn: "24h" }
    );
  }
}
