import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Record from "@/view/Record/Record";
import AudioWaveform from "@/components/audio/AudioWaveform";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="mb-4">
        <AudioWaveform />
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Record />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </main>
  );
}
