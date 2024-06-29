import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { useCallback, useEffect } from "react";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export const TextEditor: React.FC<{
  initialText: string;
  onChange: (text: string) => void;
}> = ({ initialText, onChange }) => {
  const $prepopulatedPlainText = useCallback(() => {
    const root = $getRoot();
    const paragraph = $createParagraphNode();
    paragraph.append($createTextNode(initialText));
    root.append(paragraph);
  }, []);

  return (
    <LexicalComposer
      initialConfig={{
        namespace: "text-editor",
        onError: (error) => console.error(error),
        editorState: $prepopulatedPlainText,
      }}
    >
      <TextEditorInner
        onChange={(text) => {
          onChange(text);
        }}
      />
    </LexicalComposer>
  );
};

const TextEditorInner: React.FC<{
  onChange: (text: string) => void;
}> = ({ onChange }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerTextContentListener((text) => {
      onChange(text);
    });
  }, [editor]);

  return (
    <div className="relative">
      <PlainTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={
          <ContentEditable className="pb-64 min-h-96 outline-none" />
        }
        placeholder={
          <div className="text-neutral-400 top-0 left-0 absolute pointer-events-none select-none">
            どんなことでも書いてみてください。マークダウン記法が使えます。
          </div>
        }
      />
      <HistoryPlugin />
    </div>
  );
};
