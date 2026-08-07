"use client";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PromptTemplate, promptTemplates } from "@/lib/prompt-templates";

type Props = {
  setValueTemplate: (template: PromptTemplate) => void;
  disabled?: boolean;
};

export function PromptTemplatePicker({
  setValueTemplate,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleSelectTemplate = (ctemplate: PromptTemplate) => {
    setValueTemplate(ctemplate);
    setOpen(false);
  };

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-md border"
    >
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="group w-full justify-between"
        >
          テンプレートから始める（任意）
          <ChevronDownIcon
            className="size-4 transition-transform
              group-data-[state=open]:rotate-180"
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="border-t px-3 py-2">
        <Accordion type="single" collapsible>
          {promptTemplates.map((template) => (
            <AccordionItem key={template.id} value={template.id}>
              <AccordionTrigger>{template.title}</AccordionTrigger>

              <AccordionContent
                className="h-fit max-h-40 space-y-3 overflow-y-auto"
              >
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {template.content}
                </p>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleSelectTemplate(template)}
                  disabled={disabled}
                >
                  このテンプレートを使用
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CollapsibleContent>
    </Collapsible>
  );
}
