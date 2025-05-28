import { Chip, Image } from "@heroui/react";
import React from "react";

import { colors } from "../map";
import { IItem } from "../models";

import { timeToDate } from "@/utils/timeToDate";

export const renderCell = (item: IItem, columnKey: React.Key) => {
  switch (columnKey) {
    case "sold":
      return <div>{item.sold > 0 && timeToDate(item.sold)}</div>;
    case "price":
      return <div>{item.price.toLocaleString("us")} ₽</div>;
    case "status":
      return (
        <div className="flex flex-col">
          <Chip color={item.status === "Продано" ? "success" : "default"}>
            {item.status}
          </Chip>
        </div>
      );
    case "photo":
      return (
        <>
          {item.photo.length ? (
            <div className="relative inline-block group">
              <Image
                className="cursor-pointer"
                radius="sm"
                src={item.photo.split(",")[0]}
                width={50}
              />
              <div className="absolute hidden -top-[140px] left-[60px] z-50 opacity-0 group-hover:opacity-100 group-hover:block transition-opacity duration-300 ease-in-out w-[300px] h-[300px]">
                <Image
                  className="w-full h-full object-cover"
                  radius="sm"
                  src={item.photo.split(",")[0]}
                  width={300}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
      );

    case "arrived":
      return <div>{timeToDate(item.arrived)}</div>;
    case "rating":
      let rating;
      // 2 года в миллисекундах (2 * 365.25 * 24 * 60 * 60 * 1000)
      const twoYearsInMs = 63115200000;

      // Если вещь не продана (sold = 0), используем текущее время как время продажи
      const effectiveSold =
        Number(item.sold) === 0
          ? new Date().getTime()
          : // эмуляция по месяцам
            /*new Date(
              new Date().setMonth(new Date().getMonth() + 0),
            ).getTime()*/
            Number(item.sold);

      // Рассчитываем разницу во времени между продажей (или текущим временем) и прибытием
      const timeDifference = effectiveSold - item.arrived;

      // Если разница меньше или равна 0 (моментальная продажа), рейтинг = 1000
      if (timeDifference <= 0) {
        rating = 1000;
      }
      // Если разница больше или равна 2 годам, рейтинг = 0
      else if (timeDifference >= twoYearsInMs) {
        rating = 0;
      }
      // Иначе линейно рассчитываем рейтинг от 1000 до 0
      else {
        rating = Math.floor(1000 * (1 - timeDifference / twoYearsInMs));
      }

      return (
        // @ts-ignore
        <Chip className={colors[Math.round(rating / 100) * 100]}>{rating}</Chip>
      );

    default:
      // @ts-ignore
      return item[columnKey];
  }
};
