export const columns = [
  { name: "id", uid: "id" },
  { name: "Фото", uid: "photo" },
  { name: "Артикул", uid: "article", sortable: true },
  { name: "Наименование", uid: "name", sortable: true },
  { name: "Марка", uid: "make", sortable: true },
  { name: "Модель", uid: "model", sortable: true },
  { name: "Год", uid: "year" },
  { name: "Кузов", uid: "body" },
  { name: "Двигатель", uid: "engine", sortable: true },
  { name: "Верх/Низ", uid: "top_bottom" },
  { name: "Перед/Зад", uid: "front_rear", sortable: true },
  { name: "Лев/Прав", uid: "left_right", sortable: true },
  { name: "Цвет", uid: "color", sortable: true },
  { name: "Номер", uid: "number", sortable: true },
  { name: "Комментарий", uid: "comment" },
  { name: "Цена", uid: "price" },
  { name: "Производитель", uid: "manufacturer", sortable: true },
  { name: "Новый/БУ", uid: "new_used", sortable: true },
  { name: "Статус", uid: "status" },
  { name: "Приход", uid: "arrived" },
  { name: "Продажа", uid: "sold" },
  { name: "Рейтинг", uid: "rating" },
];

export const statusOptions = [
  { name: "Продано", uid: "sold" },
  { name: "В наличии", uid: "avaliable" },
];

export const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "photo",
  "article",
  "model",
  "make",
  "body",
  "status",
  "name",
  "arrived",
  "rating",
];

export const limits = [
  { key: "50", label: "50" },
  { key: "100", label: "100" },
  { key: "500", label: "500" },
  { key: "1000", label: "1000" },
];

export const colors = {
  1000: "bg-green-500 text-default",
  900: "bg-lime-500 text-default",
  800: "bg-lime-300 text-default",
  700: "bg-yellow-300 text-default",
  600: "bg-yellow-400 text-default",
  500: "bg-orange-500 text-white",
  400: "bg-orange-600 text-white",
  300: "bg-red-600 text-white",
  200: "bg-red-800 text-white",
  100: "bg-red-950 text-white",
  0: "bg-stone-950 text-white",
};
