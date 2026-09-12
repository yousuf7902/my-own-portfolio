import { isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { headingId } from "@/lib/writing";

function flatten(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (isValidElement(node)) {
    return flatten((node.props as { children?: ReactNode }).children);
  }
  return "";
}

export default function WritingBody({ body }: { body: string }) {
  return (
    <div className="reading max-w-[680px]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 id={headingId(flatten(children))}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 id={headingId(flatten(children))}>{children}</h3>
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
