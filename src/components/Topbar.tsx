import { useState } from 'react';
import { Sun, Moon, Menu, FileText, FolderOpen } from 'lucide-react';
import type { Theme } from '../types';

interface TopbarProps {
    theme: Theme;
    onThemeToggle: () => void;
    onMenuToggle: () => void;
    sidebarOpen: boolean;
    basePath: string | null;
    onSetDirectory: (path: string) => Promise<void>;
}

export function Topbar({
    theme,
    onThemeToggle,
    onMenuToggle,
    sidebarOpen,
    basePath,
    onSetDirectory
}: TopbarProps) {
    const [showPathInput, setShowPathInput] = useState(!basePath);
    const [pathInput, setPathInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pathInput.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await onSetDirectory(pathInput.trim());
            setShowPathInput(false);
            setPathInput('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'فشل في فتح المجلد');
        } finally {
            setLoading(false);
        }
    };

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button
                    className="menu-toggle"
                    onClick={onMenuToggle}
                    aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={sidebarOpen}
                >
                    <Menu />
                </button>

                <div className="topbar-logo">
                    <FileText color="var(--color-accent)" />
                    <h1 className="topbar-title">مِداد</h1>
                    <span className="topbar-subtitle">Midad</span>
                </div>
            </div>

            <div className="topbar-center">
                {showPathInput ? (
                    <form className="path-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="path-input"
                            placeholder="أدخل مسار المجلد... (مثال: D:\Documents)"
                            value={pathInput}
                            onChange={(e) => setPathInput(e.target.value)}
                            disabled={loading}
                            dir="ltr"
                        />
                        <button
                            type="submit"
                            className="path-submit"
                            disabled={loading || !pathInput.trim()}
                        >
                            {loading ? '...' : 'فتح'}
                        </button>
                        {basePath && (
                            <button
                                type="button"
                                className="path-cancel"
                                onClick={() => setShowPathInput(false)}
                            >
                                إلغاء
                            </button>
                        )}
                    </form>
                ) : (
                    <button
                        className="change-folder-btn"
                        onClick={() => setShowPathInput(true)}
                        title="تغيير المجلد"
                    >
                        <FolderOpen />
                        <span>تغيير المجلد</span>
                    </button>
                )}
                {error && <span className="path-error">{error}</span>}
            </div>

            <div className="topbar-right">
                <button
                    className="theme-toggle"
                    onClick={onThemeToggle}
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
                >
                    {theme === 'dark' ? <Sun /> : <Moon />}
                </button>
            </div>
        </header>
    );
}
