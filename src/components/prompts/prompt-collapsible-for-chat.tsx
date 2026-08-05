"use client";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type Props = {
  promptTitle: string;
  promptContent: string;
  isOpen: boolean;
};

export default function PromptCollapsibleForChat({
  promptTitle,
  promptContent,
  isOpen,
}: Props) {
  const [open, setOpen] = useState(isOpen);
  return (
    <Collapsible
      className="flex flex-col items-end rounded-md border data-[state=open]:bg-muted"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger asChild>
        <Button type="button" variant="ghost" className="group w-fit text-xs">
          {promptTitle}
          <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-2.5 pt-0 wrap-anywhere whitespace-pre-wrap">
        {promptContent}
      </CollapsibleContent>
    </Collapsible>
  );
}
