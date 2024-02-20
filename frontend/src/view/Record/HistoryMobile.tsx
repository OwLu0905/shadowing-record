import React from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardContent, Card } from "@/components/ui/card";

const HistoryMobile = () => {
  return (
    <div>
      <div className="md:hidden flex flex-col gap-4">
        <Card className="border shadow-sm rounded-lg mt-4">
          <CardHeader>
            <h2 className="font-semibold text-lg md:text-2xl">
              Feb 6, 2024 - Meeting with team
            </h2>
          </CardHeader>
          <CardContent>
            <div className="h-6 w-full bg-gray-200 mb-4" />
            <div className="flex gap-2">
              <Button className="w-8 h-8 rounded-full">3</Button>
              <Button className="w-8 h-8 rounded-full">3</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm rounded-lg mt-4">
          <CardHeader>
            <h2 className="font-semibold text-lg md:text-2xl">
              Feb 5, 2024 - Project planning
            </h2>
          </CardHeader>
          <CardContent>
            <div className="h-6 w-full bg-gray-200 mb-4" />
            <div className="flex gap-2">
              <Button className="w-8 h-8 rounded-full">3</Button>
              <Button className="w-8 h-8 rounded-full">2</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm rounded-lg mt-4">
          <CardHeader>
            <h2 className="font-semibold text-lg md:text-2xl">
              Feb 4, 2024 - Design review
            </h2>
          </CardHeader>
          <CardContent>
            <div className="h-6 w-full bg-gray-200 mb-4" />
            <div className="flex gap-2">
              <Button className="w-8 h-8 rounded-full">1</Button>
              <Button className="w-8 h-8 rounded-full">2</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoryMobile;
