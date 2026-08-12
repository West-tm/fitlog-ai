"use client";

import { CopyIcon } from "lucide-react";

import { Button } from "../ui/button";

type Props = {
  copyText: string;
};

export default function CopyButton({ copyText }: Props) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title="コピー"
      onClick={() => {
        navigator.clipboard.writeText(copyText);
      }}
    >
      <CopyIcon className="size-4" />
    </Button>
  );
}
