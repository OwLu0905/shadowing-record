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
import { Button } from "@/components/ui/button";
import { SparkleIcon } from "lucide-react";
import { createRecord } from "@/db/record";
import { ShadowingType, ShadowingTypeMap } from "@/type/kinds";
import { useQueryClient } from "@tanstack/react-query";
import { AudioInfoType } from "@/app/(protect)/records/page";

type SubmitFormProps = {
  data: AudioInfoType;
};

const SubmitForm = (props: SubmitFormProps) => {
  const { data } = props;
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
      shadowingUrl: data.url,
      shadowingType: data["provider_name"],
    },
  });

  async function uploadFileToS3(data: Blob | null) {
    if (!data) return;

    const formData = new FormData();
    formData.append("file", data);

    try {
      const response = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const json: { message: string; data: { url: string } } =
          await response.json();

        return json.data.url;
      }
    } catch (err) {
      console.log("Can't upload this file");
    }
  }

  async function onSubmit(value: z.infer<typeof NewRecordFormSchema>) {
    const type = ShadowingTypeMap[value.shadowingType];
    switch (type) {
      case ShadowingType.File: {
        startTransition(async () => {
          if (!user?.id || !data.blob) return;
          const url = await uploadFileToS3(data.blob);
          if (url) {
            await createRecord({
              ...value,
              shadowingUrl: url,
              shadowingType: type,
              userId: user.id,
              thumbnailUrl: data.thumbnail_url,
            });

            queryClient.invalidateQueries({ queryKey: [user.id, "records"] });
          }
        });
        break;
      }
      case ShadowingType.YouTube: {
        startTransition(() => {
          if (!user?.id) return;
          createRecord({
            ...value,
            shadowingType: type,
            userId: user.id,
            thumbnailUrl: data.thumbnail_url,
          });
          queryClient.invalidateQueries({ queryKey: [user.id, "records"] });
        });
        break;
      }
    }
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
