import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Loader2, FileQuestion } from 'lucide-react';
import { detectDirection } from '../utils/detectDirection';
import type { Theme } from '../types';

interface MarkdownViewerProps {
    content: string | null;
    loading: boolean;
    theme: Theme;
    fileName?: string;
}

export function MarkdownViewer({ content, loading, theme, fileName }: MarkdownViewerProps) {
    // Detect overall document direction
    const documentDirection = useMemo(() => {
        if (!content) return 'ltr';
        return detectDirection(content);
    }, [content]);

    // Custom code component for syntax highlighting
    const CodeComponent = useMemo(() => {
        return function Code({
            inline,
            className,
            children,
            ...props
        }: {
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
            [key: string]: unknown;
        }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && match) {
                return (
                    <SyntaxHighlighter
                        style={theme === 'dark' ? oneDark : oneLight}
                        language={match[1]}
                        PreTag="div"
                        showLineNumbers
                        customStyle={{
                            margin: 0,
                            borderRadius: 'var(--radius-lg)',
                            fontSize: '0.875rem',
                        }}
                    >
                        {codeString}
                    </SyntaxHighlighter>
                );
            }

            return (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        };
    }, [theme]);

    // Custom paragraph component with per-paragraph RTL detection
    const ParagraphComponent = useMemo(() => {
        return function Paragraph({ children }: { children?: React.ReactNode }) {
            const textContent = extractTextContent(children);
            const direction = detectDirection(textContent);

            return (
                <p className={`paragraph-${direction}`} dir={direction}>
                    {children}
                </p>
            );
        };
    }, []);

    // Custom heading components with RTL detection
    const createHeadingComponent = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
        return function Heading({ children }: { children?: React.ReactNode }) {
            const textContent = extractTextContent(children);
            const direction = detectDirection(textContent);
            const Tag = `h${level}` as keyof JSX.IntrinsicElements;

            return (
                <Tag dir={direction} style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}>
                    {children}
                </Tag>
            );
        };
    };

    // Custom list item with RTL detection
    const ListItemComponent = useMemo(() => {
        return function ListItem({ children }: { children?: React.ReactNode }) {
            const textContent = extractTextContent(children);
            const direction = detectDirection(textContent);

            return (
                <li dir={direction}>
                    {children}
                </li>
            );
        };
    }, []);

    // Custom blockquote with RTL detection
    const BlockquoteComponent = useMemo(() => {
        return function Blockquote({ children }: { children?: React.ReactNode }) {
            const textContent = extractTextContent(children);
            const direction = detectDirection(textContent);

            return (
                <blockquote dir={direction}>
                    {children}
                </blockquote>
            );
        };
    }, []);

    if (loading) {
        return (
            <div className="markdown-viewer loading">
                <div className="loading-spinner">
                    <Loader2 />
                    <span>Loading document...</span>
                </div>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="markdown-viewer">
                <div className="empty-state">
                    <FileQuestion />
                    <h3>No Document Selected</h3>
                    <p>Select a document from the sidebar to view its contents.</p>
                </div>
            </div>
        );
    }

    return (
        <article
            className="markdown-viewer"
            dir={documentDirection}
            aria-label={fileName ? `Document: ${fileName}` : 'Markdown document'}
        >
            <div className="markdown-content">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        code: CodeComponent as never,
                        p: ParagraphComponent,
                        h1: createHeadingComponent(1),
                        h2: createHeadingComponent(2),
                        h3: createHeadingComponent(3),
                        h4: createHeadingComponent(4),
                        h5: createHeadingComponent(5),
                        h6: createHeadingComponent(6),
                        li: ListItemComponent,
                        blockquote: BlockquoteComponent,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </article>
    );
}

/**
 * Extracts text content from React children for direction detection
 */
function extractTextContent(children: React.ReactNode): string {
    if (typeof children === 'string') {
        return children;
    }

    if (Array.isArray(children)) {
        return children.map(extractTextContent).join('');
    }

    if (children && typeof children === 'object' && 'props' in children) {
        const element = children as React.ReactElement<{ children?: React.ReactNode }>;
        return extractTextContent(element.props.children);
    }

    return '';
}
