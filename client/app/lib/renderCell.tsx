import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Modal,
  User,
} from "@heroui/react";
import React from "react";
import { colors, statusColorMap } from "../map";
import { VerticalDotsIcon } from "@/components/icons";
import { IItem } from "../models";
import { cn } from "tailwind-variants";
import clsx from "clsx";
import { timeToDate } from "@/utils/timeToDate";

export const renderCell = (
  item: IItem,
  columnKey: string,
  timestamp?: number,
) => {
  // const cellValue = item[columnKey];
  switch (columnKey) {
    // case "name":
    //   return (
    //     <User
    //       avatarProps={{ radius: "lg", src: item.avatar }}
    //       description={item.email}
    //       name={cellValue}
    //     >
    //       {item.email}
    //     </User>
    //   );
    // case "role":
    //   return (
    //     <div className="flex flex-col">
    //       <p className="text-bold text-small capitalize">{cellValue}</p>
    //       <p className="text-bold text-tiny capitalize text-default-400">
    //         {item.team}
    //       </p>
    //     </div>
    //   );
    case "photo":
      return (
        <div className="relative inline-block group">
          <Image
            src={item.photo.split(",")[0]}
            width={50}
            radius="sm"
            className="cursor-pointer"
          />
          <div className="absolute hidden top-0 left-[60px] z-10 opacity-0 group-hover:opacity-100 group-hover:block transition-opacity duration-300 ease-in-out w-[300px] h-[300px]">
            <Image
              src={item.photo.split(",")[0]}
              width={300}
              radius="sm"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      );

    case "arrived":
      return <div>{timeToDate(item.arrived)}</div>;
    case "rating":
      let rating;
      // Если вещь не продана (sold = 0), используем текущее время как время продажи
      const effectiveSold = item.sold ? new Date().getTime() : item.sold;

      const timeDifference = effectiveSold - item.arrived; /*item.arrived*/

      // Если разница больше или равна 2 годам, рейтинг = 1000
      if (timeDifference >= 63115200000) {
        rating = 1000;
      }
      // Иначе линейно рассчитываем рейтинг от 0 до 1000
      else {
        rating = Math.floor(1000 * (1 - timeDifference / 63115200000));
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
