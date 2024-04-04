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

import { getAudiosById } from "@/db/record";

import { format } from "date-fns";
import Waveform from "@/components/waveform";

type HistoryProps = {
  recordId: string;
};

const History = async (props: HistoryProps) => {
  const { recordId } = props;

  const data = await getAudiosById(recordId);

  if (!data) return <></>;

  return (
    <div className="pb-12">
      <h2 className="text-lg font-semibold md:text-2xl">Recording History</h2>
      <div className="mt-4 hidden overflow-hidden rounded-lg border shadow-sm md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Date</TableHead>
              <TableHead className="">start</TableHead>
              <TableHead className="">end</TableHead>
              <TableHead className="w-[600px]">Waveform</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          {data.map((item) => {
            const formatDate = format(
              new Date(item.createdAt),
              "yyyy-MM-dd hh:mm",
            );
            return (
              <TableBody key={item.audioUrl}>
                <TableRow>
                  <TableCell>{formatDate}</TableCell>
                  <TableCell>{item.startSeconds}</TableCell>
                  <TableCell className="md:table-cell">
                    {item.endSeconds}
                  </TableCell>
                  <TableCell>
                    <Waveform blobData={`${item.audioUrl}`} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button className="h-8 w-8 rounded-full">2</Button>
                      <Button className="h-8 w-8 rounded-full">3</Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            );
          })}
        </Table>
      </div>
    </div>
  );
};

export default History;
