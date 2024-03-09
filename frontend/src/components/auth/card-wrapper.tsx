"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { BackButton } from "@/components/auth/back-button";
import { FormHeader } from "@/components/auth/form-header";
import SocialButton from "@/components/auth/social-button";
// import { Header } from "./header";
// import { Social } from "./socail";
// import { BackButton } from "./back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  formTitle: string;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}
const CardWrapper = ({
  children,
  formTitle,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <FormHeader title={formTitle} label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <SocialButton />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
