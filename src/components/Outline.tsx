import { useEffect, useState, useMemo } from 'react';
import { List, ChevronLeft, ChevronRight } from 'lucide-react';
import { detectDirection } from '../utils/detectDirection';

interface HeadingItem {
    id: string;
    text: string;
    level: number;
}

interface OutlineProps {
    content: string | null;
    isOpen: boolean;
    onToggle: () => void;
    dir: 'rtl' | 'ltr';
}

/**
 * Slugify function to generate compatible IDs for headings
 */
export function slugifyHeading(text: string): string {
    return text
        .toLowerCase()
        // Keep alphanumeric, spaces, and Arabic unicode ranges, strip others
        .replace(/[^\w\s\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

/**
 * Parse headings from raw markdown text, ignoring headings within code blocks
 */
export function parseHeadings(markdown: string): HeadingItem[] {
    const headings: HeadingItem[] = [];
    const lines = markdown.split('\n');
    let inCodeBlock = false;

    for (let line of lines) {
        line = line.trim();

        // Toggle code block state
        if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }

        // Ignore lines inside code blocks
        if (inCodeBlock) {
            continue;
        }

        // Match ATX headings: # Heading
        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            let text = headingMatch[2].trim();

            // Strip simple markdown formatting like bold, italic, links from the title
            text = text
                .replace(/\*\*([^*]+)\*\*/g, '$1')
                .replace(/\*([^*]+)\*/g, '$1')
                .replace(/__([^_]+)__/g, '$1')
                .replace(/_([^_]+)_/g, '$1')
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

            headings.push({
                id: slugifyHeading(text),
                text,
                level,
            });
        }
    }

    return headings;
}

export function Outline({ content, isOpen, onToggle, dir }: OutlineProps) {
    const [activeId, setActiveId] = useState<string>('');

    // Extract headings whenever content changes
    const headings = useMemo(() => {
        if (!content) return [];
        return parseHeadings(content);
    }, [content]);

    // Active heading tracking on scroll
    useEffect(() => {
        if (headings.length === 0) return;

        const handleScroll = () => {
            const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];

            if (headingElements.length === 0) return;

            // Find the heading that is closest to the top of the viewport but not passed it
            const scrollPosition = window.scrollY + 100; // Offset for topbar
            let currentActive = headings[0].id;

            for (const el of headingElements) {
                if (el.offsetTop <= scrollPosition) {
                    currentActive = el.id;
                } else {
                    break;
                }
            }

            setActiveId(currentActive);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Trigger once initially
        setTimeout(handleScroll, 100);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [headings]);

    const handleHeadingClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -80; // Offset for sticky topbar
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    if (headings.length === 0) return null;

    return (
        <>
            {/* Outline Toggle Floating Button */}
            <button
                className={`outline-toggle-fab ${dir === 'rtl' ? 'rtl' : 'ltr'} ${isOpen ? 'sidebar-open' : ''}`}
                onClick={onToggle}
                title={isOpen ? "إخلاق الفهرس" : "عرض الفهرس"}
                aria-label="Toggle Outline"
            >
                <List size={20} />
                {isOpen ? (
                    dir === 'rtl' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
                ) : (
                    dir === 'rtl' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />
                )}
            </button>

            {/* Outline Sidebar Container */}
            <aside className={`outline-sidebar ${isOpen ? 'open' : ''} ${dir === 'rtl' ? 'rtl' : 'ltr'}`}>
                <div className="outline-header">
                    <List size={18} />
                    <h3>محتويات الكتاب</h3>
                </div>
                <nav className="outline-nav">
                    <ul className="outline-list">
                        {headings.map((heading, index) => {
                            const isRtl = detectDirection(heading.text) === 'rtl';
                            return (
                                <li
                                    key={`${heading.id}-${index}`}
                                    className={`outline-item level-${heading.level} ${activeId === heading.id ? 'active' : ''}`}
                                    dir={isRtl ? 'rtl' : 'ltr'}
                                >
                                    <button
                                        onClick={() => handleHeadingClick(heading.id)}
                                        className="outline-link"
                                        title={heading.text}
                                    >
                                        <span className="outline-indicator"></span>
                                        <span className="outline-text">{heading.text}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </>
    );
}
