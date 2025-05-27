import axios from "axios";
import csv from "csvtojson";
import iconv from "iconv-lite";
import { Pool } from "../utils/Pool";

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
          article: Number(arr[0]),
          name: arr[1],
          make: arr[2],
          model: arr[3],
          year: arr[4],
          body: arr[5],
          engine: arr[6],
          top_bottom: arr[7],
          front_rear: arr[8],
          left_right: arr[9],
          color: arr[10],
          number: arr[11],
          comment: arr[12],
          price: Number(arr[13]),
          manufacturer: arr[14],
          photo: arr[15]
            .split(",")
            .map((a) => a.trim())
            .toString(),
          new_used: arr[16],
          status: arr[17],
        };
        items.push(item);
      }
      const bd_items = await Pool.conn.data.findMany();
      // есть в цсв но нет в бд -> добавляем новый товар
      const news = items
        .filter(
          (o1) => !bd_items.some((o2) => o1.article === Number(o2.article))
        )
        .map((item) => ({ ...item, arrived: new Date().getTime(), sold: 0 }));

      await Pool.conn.data.createMany({
        data: news,
      });

      // есть в бд но нет в цсв -> товар продан
      const sold = bd_items
        .filter((o1) => !items.some((o2) => Number(o1.article) === o2.article))
        .map((item) => ({
          ...item,
          sold: new Date().getTime(),
          status: "Продано",
        }));

      await Pool.conn.$transaction(async (tx) => {
        for (const item of sold) {
          await tx.data.update({
            where: {
              article: item.article, // Условие для поиска записи
            },
            data: {
              ...item, // Данные для обновления
            },
          });
        }
      });
      return jsonArray;
    } catch (error) {
      console.error("Error fetching or parsing CSV:", error.message);
      throw error;
    }
  }

  static async collect({
    limit,
    offset,
    status,
    query,
    column,
    direction,
  }: {
    limit: string;
    offset: string;
    status: string;
    query: string;
    column: string;
    direction: string;
  }) {
    try {
      const searchTerms = query
        ? query
            .trim()
            .split(/\s+/)
            .filter((term) => term.length > 2) // Игнорируем короткие слова, можно настроить
        : [];

      const where = {
        ...(status === "all" ? {} : { status }),
        ...(searchTerms.length > 0
          ? {
              AND: searchTerms.map((term) => {
                // numbers
                const numericTerm = Number(term);
                const articleCondition = !isNaN(numericTerm)
                  ? [{ article: { equals: numericTerm } }]
                  : [];

                // string
                const stringConditions = [
                  { name: { contains: term, mode: "insensitive" } },
                  { make: { contains: term, mode: "insensitive" } },
                  { model: { contains: term, mode: "insensitive" } },
                  { year: { contains: term, mode: "insensitive" } },
                  { engine: { contains: term, mode: "insensitive" } },
                  { body: { contains: term, mode: "insensitive" } },
                  { top_bottom: { contains: term, mode: "insensitive" } },
                  { front_rear: { contains: term, mode: "insensitive" } },
                  { left_right: { contains: term, mode: "insensitive" } },
                  { color: { contains: term, mode: "insensitive" } },
                  { number: { contains: term, mode: "insensitive" } },
                  { comment: { contains: term, mode: "insensitive" } },
                  { new_used: { contains: term, mode: "insensitive" } },
                ];
                return {
                  OR: [...articleCondition, ...stringConditions],
                };
              }),
            }
          : {}),
      };

      const items = await Pool.conn.data.findMany({
        take: Number(limit),
        skip: Number(offset),
        where,
        orderBy: column
          ? {
              [column]: direction === "ascending" ? "asc" : "desc",
            }
          : { article: "asc" },
      });

      return {
        items: JSON.stringify(items, (_, v) =>
          typeof v === "bigint" ? v.toString() : v
        ),
        count: await Pool.conn.data.count({ where }),
      };
    } catch (e) {
      console.error("Error fetching or parsing CSV:", e);
      throw e;
    }
  }
}
