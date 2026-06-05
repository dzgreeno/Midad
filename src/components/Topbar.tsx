import { useState } from 'react';
import { Sun, Moon, Menu, FileText, FolderOpen, Settings, Eye, EyeOff } from 'lucide-react';
import { ReadingSettingsPanel } from './ReadingSettingsPanel';
import type { Theme, ReadingSettings } from '../types';

interface TopbarProps {
    theme: Theme;
    onThemeToggle: () => void;
    onMenuToggle: () => void;
    sidebarOpen: boolean;
    basePath: string | null;
    onSetDirectory: (path: string) => Promise<void>;
    readingSettings: ReadingSettings;
    onReadingSettingsChange: (settings: ReadingSettings) => void;
    focusMode: boolean;
    onFocusModeToggle: () => void;
}

export function Topbar({
    theme,
    onThemeToggle,
    onMenuToggle,
    sidebarOpen,
    basePath,
    onSetDirectory,
    readingSettings,
    onReadingSettingsChange,
    focusMode,
    onFocusModeToggle
}: TopbarProps) {
    const [showPathInput, setShowPathInput] = useState(!basePath);
    const [pathInput, setPathInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);

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
                {!focusMode && (
                    <button
                        className="menu-toggle"
                        onClick={onMenuToggle}
                        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={sidebarOpen}
                        style={{ display: 'flex' }} // Force display menu toggle if not in focus mode on mobile
                    >
                        <Menu />
                    </button>
                )}

                <div className="topbar-logo">
                    <FileText color="var(--color-accent)" />
                    <h1 className="topbar-title">مِداد</h1>
                    <span className="topbar-subtitle">Midad</span>
                </div>
            </div>

            <div className="topbar-center">
                {!focusMode && (
                    showPathInput ? (
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
                    )
                )}
                {error && <span className="path-error">{error}</span>}
            </div>

            <div className="topbar-right">
                {/* Focus / Reading Mode Toggle */}
                <button
                    className={`focus-toggle-btn ${focusMode ? 'active' : ''}`}
                    onClick={onFocusModeToggle}
                    title={focusMode ? 'خروج من وضع القراءة' : 'وضع القراءة بتركيز (Zen)'}
                    aria-label="Toggle Focus Mode"
                >
                    {focusMode ? <EyeOff /> : <Eye />}
                </button>

                {/* Typography / Reading Settings Dropdown */}
                <div style={{ position: 'relative' }}>
                    <button
                        className={`settings-toggle-btn ${settingsOpen ? 'active' : ''}`}
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        title="إعدادات الخط والصفحة"
                        aria-label="Reading Settings"
                    >
                        <Settings />
                    </button>
                    <ReadingSettingsPanel
                        settings={readingSettings}
                        onChange={onReadingSettingsChange}
                        isOpen={settingsOpen}
                        onClose={() => setSettingsOpen(false)}
                    />
                </div>

                {/* Dark Mode Toggle */}
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

