import React from "react";
import { Button } from "@/components/ui/button";

import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";

const History = () => {
  return (
    <div>
      <h2 className="font-semibold text-lg md:text-2xl">Recording History</h2>
      <div className="hidden md:block border shadow-sm rounded-lg mt-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Date</TableHead>
              <TableHead className="max-w-[150px]">Topic</TableHead>
              <TableHead className="md:table-cell">Duration</TableHead>
              <TableHead className="w-[50%]">Waveform</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Feb 6, 2024</TableCell>
              <TableCell>Meeting with team</TableCell>
              <TableCell className="md:table-cell">1h 30m</TableCell>
              <TableCell>
                <div className="h-6 w-full bg-gray-200" />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button className="w-8 h-8 rounded-full">2</Button>
                  <Button className="w-8 h-8 rounded-full">3</Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default History;
