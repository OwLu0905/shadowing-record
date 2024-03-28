import { Button } from "@/components/ui/button";
import { useEditorEventCallback } from "@nytimes/react-prosemirror";
import { CopyCheck } from "lucide-react";

const PasteButton = () => {
  const onClick = useEditorEventCallback(async (view) => {
    if (!view.editable) return;
    try {
      const text = await navigator.clipboard.readText();
      if (view && view.state && view.state.doc) {
        const { from, to } = view.state.selection;
        view.dispatch(view.state.tr.insertText(text, from, to));
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  });

  return (
    <Button size="sm" variant={"secondary"} onClick={onClick}>
      Paste
      <CopyCheck className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default PasteButton;
