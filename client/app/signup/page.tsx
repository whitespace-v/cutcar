"use client";
import React, { useState } from "react";
import { Form, Input, Button, Link, InputOtp, Spinner } from "@heroui/react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";

import { AxiosInterceptor } from "@/utils/http";

export default function App() {
  const [value, setValue, removeValue] = useLocalStorage("token", "");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    let data = Object.fromEntries(new FormData(e.currentTarget));
    const req = await AxiosInterceptor.$post("/users/signup", data);

    setLoading(false);

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
          register(e);
        }}
      >
        <Input
          isRequired
          errorMessage="Неправильный логин"
          label="Логин"
          labelPlacement="outside"
          name="login"
          placeholder="Придумайте логин"
          type="text"
        />

        <Input
          isRequired
          errorMessage="Направильный пароль"
          label="Пароль"
          labelPlacement="outside"
          name="password"
          placeholder="Придумайте пароль"
          type="password"
        />

        {/* <Input
          isRequired
          errorMessage="Направильный пароль"
          label="Ключ"
          labelPlacement="outside"
          name="key"
          placeholder="Введите ключ"
          type="password"
        /> */}

        <div>
          <div>Ключ</div>
          <InputOtp
            isRequired
            errorMessage="Неправильный ключ"
            length={6}
            name="key"
            radius="full"
            size="sm"
            type="password"
            variant="bordered"
          />
        </div>

        <Button className="w-full" color="success" type="submit">
          Регистрация
        </Button>
        <Link href="/signin">Уже есть аккаунт ?</Link>
      </Form>
    </div>
  );
}
