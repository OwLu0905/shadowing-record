"use client";
import React, { useRef, useState } from "react";
import { useAudioListQuery } from "@/api/record/useAudioList";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import Waveform from "@/components/waveform";
import WarningDialog from "@/components/common/warn-dialog";

import { format } from "date-fns";
import { PlayIcon, Trash2 } from "lucide-react";
import { deleteaAudioById } from "@/db/record";
import toast from "react-hot-toast";

type HistoryProps = {
  recordId: string;
};

// TODO: move history to client component ( use useQuery to cache the data)
const History = (props: HistoryProps) => {
  const { recordId } = props;
  const { data, isLoading } = useAudioListQuery(recordId);
  const [warning, setWarning] = useState(false);
  const queryClient = useQueryClient();
  const audioIdRef = useRef<number | null>(null);

  // TODO: useMutation
  async function onConfirmDeleteAudio() {
    if (!audioIdRef.current) return;
    try {
      await deleteaAudioById(audioIdRef.current);
      toast.success("OK");
      audioIdRef.current = null;
      queryClient.invalidateQueries({ queryKey: [recordId, "history"] });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="pb-12">
      <h2 className="text-lg font-semibold md:text-2xl">Recording History</h2>
      <div className="mt-4 overflow-hidden rounded-lg border shadow-sm md:block">
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
          {!data || isLoading ? (
            <TableBody>
              <TableRow>
                <TableCell>
                  <Skeleton className="h-12 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-12 w-full" />
                </TableCell>
                <TableCell className="md:table-cell">
                  <Skeleton className="h-12 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-12 w-full" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-x-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            data.map((item) => {
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
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="rounded-full"
                        >
                          <PlayIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="rounded-full"
                          onClick={() => {
                            audioIdRef.current = item.audioId;
                            setWarning(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              );
            })
          )}
        </Table>
      </div>

      <WarningDialog
        show={warning}
        handleClose={setWarning}
        label={"Delete"}
        title="Warning: Delete Audio"
        description="Do you want to continue delete or return?"
        onConfirm={onConfirmDeleteAudio}
      />
    </div>
  );
};

export default History;
