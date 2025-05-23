import axios from "axios";
import csv from "csvtojson";
import iconv from "iconv-lite";

export class DataController {
  static async fetch() {
    try {
      const response = await axios.get(
        "https://baz-on.ru/export/c3063/4da8e/cutcar-drom.csv",
        { responseType: "arraybuffer" }
      );

      const jsonArray = await csv({
        quote: '"',
      }).fromString(iconv.decode(Buffer.from(response.data), "win1251"));
      const allStringValues: string[] = jsonArray.flatMap(
        (row: Record<string, string>) =>
          Object.values(row).filter((value) => value.trim() !== "")
      );
      let items = [];
      for (let i of allStringValues) {
        const arr = i
          .replace(/\\"/g, "")
          .replace(/"/g, "")
          .split(";")
          .map((a) => a.trim());

        const item = {
          Артикул: arr[0],
          Наименование: arr[1],
          Марка: arr[2],
          Модель: arr[3],
          Год: arr[4],
          Кузов: arr[5],
          Двигатель: arr[6],
          "Верх/Низ": arr[7],
          "Перед/Зад": arr[8],
          "Лев/Прав": arr[9],
          Цвет: arr[10],
          Номер: arr[11],
          Комментарий: arr[12],
          Цена: arr[13],
          Производитель: arr[14],
          Фото: arr[15].split(",").map((a) => a.trim()),
          "Новый/БУ": arr[16],
          Статус: arr[17],
        };
        // 1. check if exists in bd, if it doesn't -> create with date & rating 1000
        // 2. if yes -> change rating [1000max-1min]
        // 3. if in bd but not in csv -> status SOLD (check where check_timestamp < now-10h)
        items.push(item);
      }

      return jsonArray;
    } catch (error) {
      console.error("Error fetching or parsing CSV:", error.message);
      throw error;
    }
  }

  static async get() {}
}
