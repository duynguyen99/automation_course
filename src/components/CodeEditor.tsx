"use client";

import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import type { FriendlyError } from "@/lib/types";

type Monaco = Parameters<BeforeMount>[0];
type EditorInstance = Parameters<OnMount>[0];

interface Props {
  /** File name; also the Monaco model path so each tab keeps its own undo history. */
  path: string;
  value: string;
  readOnly?: boolean;
  onChange: (code: string) => void;
  onRun: () => void;
  errors: FriendlyError[];
}

export function languageOf(path: string): string {
  if (path.endsWith(".feature")) return "gherkin";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".java")) return "java";
  return "plaintext";
}

let registered = false;

const setupMonaco: BeforeMount = (monaco) => {
  if (!registered) {
    registered = true;
    monaco.languages.register({ id: "gherkin" });
    monaco.languages.setMonarchTokensProvider("gherkin", {
      tokenizer: {
        root: [
          [/^\s*#.*$/, "comment"],
          [/^\s*@[\w-]+/, "annotation"],
          [/^\s*(Feature|Background|Scenario Outline|Scenario Template|Scenario|Rule|Examples|Tính năng|Kịch bản|Bối cảnh|Dữ liệu):/, "keyword"],
          [/^\s*(Given|When|Then|And|But|\*|Biết|Khi|Thì|Và|Nhưng)\b/, "type"],
          [/"[^"]*"/, "string"],
          [/<[^>]+>/, "variable"],
          [/\|/, "delimiter"],
          [/\b\d+(\.\d+)?\b/, "number"],
        ],
      },
    });
  }
  monaco.editor.defineTheme("qa-desk", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "f0a868" },
      { token: "string", foreground: "a8d38b" },
      { token: "number", foreground: "e9c46a" },
      { token: "comment", foreground: "7c8496", fontStyle: "italic" },
      { token: "type", foreground: "8cc4ff" },
      { token: "type.identifier", foreground: "f2d48f" },
      { token: "annotation", foreground: "d6a8ff" },
      { token: "variable", foreground: "d6a8ff" },
    ],
    colors: {
      "editor.background": "#191c25",
      "editor.foreground": "#e7e2d6",
      "editorLineNumber.foreground": "#4b5161",
      "editorLineNumber.activeForeground": "#c9c3b5",
      "editor.lineHighlightBackground": "#20242f",
      "editorCursor.foreground": "#f4d774",
      "editor.selectionBackground": "#3a4258",
      "editorIndentGuide.background1": "#262a35",
      "editorWidget.background": "#222632",
    },
  });
};

export function CodeEditor({ path, value, readOnly = false, onChange, onRun, errors }: Props) {
  const editorRef = useRef<EditorInstance | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  // Monaco registers the Ctrl+Enter command once, so it reads the latest onRun through a ref.
  const runRef = useRef(onRun);
  useEffect(() => {
    runRef.current = onRun;
  }, [onRun]);

  // Red squiggles on the lines the compiler complained about, with the Vietnamese explanation.
  useEffect(() => {
    const monaco = monacoRef.current;
    const model = editorRef.current?.getModel();
    if (!monaco || !model) return;
    monaco.editor.setModelMarkers(
      model,
      "qa",
      errors
        .filter((e) => e.line && e.line <= model.getLineCount() && (!e.file || e.file === path))
        .map((e) => ({
          startLineNumber: e.line!,
          endLineNumber: e.line!,
          startColumn: model.getLineFirstNonWhitespaceColumn(e.line!) || 1,
          endColumn: model.getLineMaxColumn(e.line!),
          message: `${e.title}\n${e.detail}`,
          severity: monaco.MarkerSeverity.Error,
        })),
    );
  }, [errors, path]);

  const onMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current());
  };

  return (
    <Editor
      height="100%"
      path={path}
      language={languageOf(path)}
      theme="qa-desk"
      value={value}
      onChange={(v) => onChange(v ?? "")}
      beforeMount={setupMonaco}
      onMount={onMount}
      loading={<p className="p-4 font-mono text-sm text-desk-muted">Đang mở trình soạn code…</p>}
      options={{
        readOnly,
        fontFamily: "var(--font-code), ui-monospace, monospace",
        fontLigatures: false,
        fontSize: 15,
        lineHeight: 24,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        tabSize: 4,
        insertSpaces: true,
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
        renderLineHighlight: "line",
        smoothScrolling: true,
        cursorBlinking: "smooth",
        wordWrap: "on",
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true },
        fixedOverflowWidgets: true,
      }}
    />
  );
}
