import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

/** Server-rendered lesson markdown with Java highlighting. */
export function Markdown({ children, className = "prose-book" }: { children: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeHighlight, { detect: false }]]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

/** Inline markdown for short strings such as test descriptions (no paragraph wrapper). */
export function InlineMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{ p: ({ children: c }) => <>{c}</> }}
      allowedElements={["p", "code", "strong", "em"]}
      unwrapDisallowed
    >
      {children}
    </ReactMarkdown>
  );
}
