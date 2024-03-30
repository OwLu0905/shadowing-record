import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";

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

type SubmitForm = {
  data: YoutubeOEmbedResponse;
  url: string;
};
const SubmitForm = (props: SubmitForm) => {
  const { data, url } = props;

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

  function onSubmit(data: z.infer<typeof NewRecordFormSchema>) {
    console.log(data);
  }

  return (
    <Form {...forms}>
      <form className="space-y-6" onSubmit={forms.handleSubmit(onSubmit)}>
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

        <Button size="sm" className="float-end">
          Start Exercising <SparkleIcon className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
};

export default SubmitForm;
