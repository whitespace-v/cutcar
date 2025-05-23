export class Console {
  static log(color: t_color, msg: any): void {
    console.log(colors[color] + msg.toString() + "\x1b[0m");
  }
}
const colors = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  crimson: "\x1b[38m", // Scarlet
};

type t_color =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray"
  | "crimson";
