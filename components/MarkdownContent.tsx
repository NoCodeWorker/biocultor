'use client';

import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = '' }: Props) {
  return (
    <ReactMarkdown
      className={className}
      components={{
        h2: ({ children }) => (
          <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight pt-6 pb-2 text-foreground">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-heading font-semibold tracking-tight pt-4 pb-1 text-foreground">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-muted-foreground leading-relaxed text-lg">
            {children}
          </p>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary/40 pl-6 py-1 italic text-muted-foreground text-lg leading-relaxed bg-primary/5 rounded-r-xl">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => (
          <ul className="space-y-2 pl-5 list-disc text-muted-foreground text-lg leading-relaxed">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="space-y-2 pl-5 list-decimal text-muted-foreground text-lg leading-relaxed">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">{children}</li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-muted-foreground">{children}</em>
        ),
        hr: () => (
          <hr className="border-border/40 my-2" />
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-primary hover:underline underline-offset-4"
          >
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-muted rounded-xl p-4 overflow-x-auto text-sm font-mono">
            {children}
          </pre>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
