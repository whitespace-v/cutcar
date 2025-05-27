"use client";
import React, { useState } from "react";
import { Form, Input, Button, Link, Spinner } from "@heroui/react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";

import { AxiosInterceptor } from "@/utils/http";

export default function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue, removeValue] = useLocalStorage("token", "");
  const router = useRouter();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    let data = Object.fromEntries(new FormData(e.currentTarget));
    const req = await AxiosInterceptor.$post("/users/signin", data);

    setLoading(false);
    console.log(req);

    if (req.status !== 200) {
      toast.error(req.message);
    } else {
      setValue(req.body.token);
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner color="primary" label="Загрузка..." labelColor="primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Form
        className="w-full max-w-xs flex flex-col gap-4 "
        onSubmit={async (e) => {
          e.preventDefault();
          login(e);
        }}
      >
        <Input
          isRequired
          errorMessage="Неправильный логин"
          label="Логин"
          labelPlacement="outside"
          name="login"
          placeholder="Введите логин"
          type="text"
        />

        <Input
          isRequired
          errorMessage="Направильный пароль"
          label="Пароль"
          labelPlacement="outside"
          name="password"
          placeholder="Введите пароль"
          type="password"
        />

        <Button className="w-full" color="success" type="submit">
          Логин
        </Button>
        <Link href="/signup">Нет аккаунта ?</Link>
      </Form>
    </div>
  );
}
