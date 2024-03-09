import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

const socialList = ["google"];

const SocialButton = () => {
  function handleOnClick(provider: "google") {}

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        size="lg"
        className="w-full border-none hover:text-foreground bg-accent/40 hover:bg-accent/30  gap-x-2"
        variant={"outline"}
        onClick={() => handleOnClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
        <p className="text-lg">Google</p>
      </Button>
    </div>
  );
};

export default SocialButton;
