import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Record from "@/view/Record/Record";
import Component from "@/view/Record/Tmp";

export default function Home() {
  return (
    <main className="flex w-full min-h-screen flex-col mx-auto">
      <Component />
      {/**       <Card className="w-full">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Record />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      */}
    </main>
  );
}
