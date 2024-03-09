"use client";
import * as z from "zod";
import CardWrapper from "./card-wrapper";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schema/login";
import { Input } from "@/components/ui/input";

const LoginForm = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <CardWrapper
      formTitle="Login"
      headerLabel="Get Started"
      backButtonLabel=""
      backButtonHref="/"
      showSocial
    >
      <Form {...form}>
        <form className="flex flex-col gap-4" action="">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="example@example.com"
                      type="email"
                      // disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="********"
                      type="password"
                      // disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </form>
      </Form>
      <div className="border-b relative mt-8 border-ring/40">
        <span className="absolute right-1/2 translate-x-1/2 -top-[12px] bg-background mx-auto px-3">
          OR
        </span>
      </div>
    </CardWrapper>
  );
};

export default LoginForm;
