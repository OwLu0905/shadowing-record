"use client";
import React, { useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { useSession } from "next-auth/react";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { NewRecordFormSchema } from "@/schema/records";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { YoutubeOEmbedResponse } from "@/api/youtube";
import { Button } from "@/components/ui/button";
import { SparkleIcon } from "lucide-react";
import { createRecord } from "@/db/record";
import { ShadowingTypeMap } from "@/type/kinds";
import { useQueryClient } from "@tanstack/react-query";

type SubmitForm = {
  data: YoutubeOEmbedResponse;
  url: string;
};
const SubmitForm = (props: SubmitForm) => {
  const { data, url } = props;
  const session = useSession();
  const user = session.data?.user;
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const forms = useForm<z.infer<typeof NewRecordFormSchema>>({
    resolver: zodResolver(NewRecordFormSchema),
    defaultValues: {
      title: "",
      description: "",
      shadowingUrl: "",
      shadowingType: "",
    },
    values: {
      title: data.title,
      description: "",
      shadowingUrl: url,
      shadowingType: data["provider_name"],
    },
  });

  async function onSubmit(data: z.infer<typeof NewRecordFormSchema>) {
    const type = ShadowingTypeMap[data.shadowingType];
    startTransition(() => {
      if (!user?.id) return;
      createRecord({
        ...data,
        shadowingType: type,
        userId: user.id,
      });
      queryClient.invalidateQueries({ queryKey: ["records"] });
      console.log("invalidateQueries");
    });
  }

  return (
    <Form {...forms}>
      <form
        className="flex flex-col gap-4"
        onSubmit={forms.handleSubmit(onSubmit)}
      >
        <FormField
          control={forms.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={forms.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={forms.control}
          name="shadowingUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="url"
                  readOnly={true}
                  disabled={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={forms.control}
          name="shadowingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="type"
                  readOnly={true}
                  disabled={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          size="sm"
          className="w-full self-end md:w-fit"
          disabled={isPending}
        >
          Start Exercising <SparkleIcon className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
};

export default SubmitForm;
