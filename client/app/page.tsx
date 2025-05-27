"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Spinner,
  SortDescriptor,
  Selection,
} from "@heroui/react";
import { useDebounceCallback, useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";

import { columns, INITIAL_VISIBLE_COLUMNS, statusOptions } from "./map";
import { renderCell } from "./lib/renderCell";
import { IItem } from "./models";

import { ChevronDownIcon, SearchIcon } from "@/components/icons";
import { capitalize } from "@/components/primitives";
import { AxiosInterceptor } from "@/utils/http";

export default function App() {
  const [value, setValue, removeValue] = useLocalStorage("token", "");
  const router = useRouter();

  useEffect(() => {
    !value && router.push("/signin");
  }, [value]);

  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const [items, setItems] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [limit, setLimit] = React.useState(12);
  const [loading, setLoading] = React.useState<boolean>(true);

  const [query, setQuery] = useState<string>("");
  const debounced = useDebounceCallback(setQuery, 500);

  const [sort, setSort] = React.useState<SortDescriptor>({
    column: "article",
    direction: "ascending",
  });

  useEffect(() => {
    getItems();
  }, [page, limit, statusFilter, query, sort]);

  const getItems = async () => {
    setLoading(true);
    const data = await AxiosInterceptor.$get("/data/collect", {
      status: statusFilter === "all" ? ["all"] : Array.from(statusFilter),
      column: sort.column,
      direction: sort.direction,
      query,
      limit,
      offset: (page - 1) * limit,
    });

    setItems(JSON.parse(data.items));
    setCount(JSON.parse(data.count));
    setPages(Math.round(JSON.parse(data.count) / limit));
    setLoading(false);
  };

  const headerColumns = () => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  };

  const onNextPage = () => {
    if (page < pages) {
      setPage(page + 1);
    }
  };

  const onPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const topContent = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Введите запрос..."
            startContent={<SearchIcon />}
            onChange={(e) => debounced(e.currentTarget.value)}
            onClear={() => debounced("")}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Статус
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Колонки
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button className="bg-red-500" onPress={() => removeValue()}>
              Выход
            </Button>
          </div>
        </div>
        {/* <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Всего позиций: {count}
          </span>
          <Select
            className="max-w-xs"
            label="Элементов на странице"
            onChange={(e) => onLimitChange(Number(e.target.value))}
            value={limit.toString()}
            defaultSelectedKeys={limit.toString()}
            selectedKeys={[limit.toString()]}
            selectionMode="single"
            items={limits}
          >
            {(limit) => <SelectItem key={limit.key}>{limit.label}</SelectItem>}
          </Select>
        </div> */}
      </div>
    );
  };

  const bottomContent = () => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="default"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <span className="text-default-400 text-small">
          Всего позиций: {count}
        </span>
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Назад
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Вперед
          </Button>
        </div>
      </div>
    );
  };
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (!value) {
      setShouldRender(false);
    }
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <Table
      isHeaderSticky
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={bottomContent()}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[1000px] overflow-visible",
      }}
      sortDescriptor={sort}
      topContent={topContent()}
      topContentPlacement="outside"
      onSortChange={setSort}
    >
      <TableHeader columns={headerColumns()}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={"Позиции не найдены."}
        isLoading={loading}
        items={items}
        loadingContent={<Spinner label="Загрузка..." />}
      >
        {(item: IItem) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
