import { useState, useCallback, useEffect } from 'react';
import { Topbar, Sidebar, MarkdownViewer, DropZone, Outline } from './components';
import { useMarkdownFiles, useTheme } from './hooks';
import type { ReadingSettings } from './types';
import { X, Eye } from 'lucide-react';
import { detectDirection } from './utils/detectDirection';
import './App.css';

interface UploadedFile {
    name: string;
    content: string;
    path: string;
}

function App() {
    const {
        files,
        selectedFile,
        content,
        loading,
        error,
        currentPath,
        basePath,
        selectFile,
        goBack,
        setDirectory,
        isDemoMode
    } = useMarkdownFiles();
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // State for reading customization settings
    const [readingSettings, setReadingSettings] = useState<ReadingSettings>(() => {
        const stored = localStorage.getItem('reading-settings');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                // fallback
            }
        }
        return {
            fontFamily: 'tajawal',
            fontSize: 'md',
            lineHeight: 'normal',
            pageWidth: 'normal',
            layoutStyle: 'scroll'
        };
    });

    // Save reading settings
    useEffect(() => {
        localStorage.setItem('reading-settings', JSON.stringify(readingSettings));
    }, [readingSettings]);

    // Focus / Zen reading mode state
    const [focusMode, setFocusMode] = useState(false);

    // Table of contents outline state
    const [outlineOpen, setOutlineOpen] = useState(true);

    // Lightbox image zoom state
    const [zoomImage, setZoomImage] = useState<{ url: string; alt: string } | null>(null);

    // Reading scroll progress percentage state
    const [scrollProgress, setScrollProgress] = useState(0);

    // State for uploaded files (drag & drop / file picker)
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [selectedUploadedFile, setSelectedUploadedFile] = useState<UploadedFile | null>(null);

    // Close outline on small screens by default
    useEffect(() => {
        if (window.innerWidth <= 1024) {
            setOutlineOpen(false);
        }
    }, [selectedFile, selectedUploadedFile]);

    // Scroll listener for reading progress bar
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const progress = (window.scrollY / totalHeight) * 100;
                setScrollProgress(progress);
            } else {
                setScrollProgress(0);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMenuToggle = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const handleSidebarClose = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    const handleFilesLoaded = useCallback((files: UploadedFile[]) => {
        setUploadedFiles(prev => {
            // Avoid duplicates
            const existingPaths = new Set(prev.map(f => f.path));
            const newFiles = files.filter(f => !existingPaths.has(f.path));
            return [...prev, ...newFiles];
        });
    }, []);

    const handleSelectUploadedFile = useCallback((file: UploadedFile) => {
        setSelectedUploadedFile(file);
    }, []);

    const handleClearFiles = useCallback(() => {
        setUploadedFiles([]);
        setSelectedUploadedFile(null);
    }, []);

    const handleImageClick = useCallback((url: string, alt: string) => {
        setZoomImage({ url, alt });
    }, []);

    const handleReadingSettingsChange = useCallback((newSettings: ReadingSettings) => {
        setReadingSettings(newSettings);
    }, []);

    const handleFocusModeToggle = useCallback(() => {
        setFocusMode(prev => !prev);
    }, []);

    const handleOutlineToggle = useCallback(() => {
        setOutlineOpen(prev => !prev);
    }, []);

    // Determine what content to show
    const displayContent = selectedUploadedFile?.content ?? content;
    const displayFileName = selectedUploadedFile?.name ?? selectedFile?.name;
    const hasUploadedFiles = uploadedFiles.length > 0;

    // Show DropZone in main content when in demo mode and no uploaded files
    const showDropZone = isDemoMode && !selectedFile && !hasUploadedFiles;

    const docDirection = detectDirection(displayContent || '');

    // Class names for app layout
    const appClasses = [
        'app',
        focusMode ? 'focus-mode-active' : '',
        outlineOpen && displayContent ? 'outline-sidebar-open' : ''
    ].join(' ');

    return (
        <div className={appClasses}>
            {/* Reading progress bar */}
            {displayContent && (
                <div
                    className="reading-progress-bar"
                    style={{ width: `${scrollProgress}%` }}
                    aria-hidden="true"
                />
            )}

            <Topbar
                theme={theme}
                onThemeToggle={toggleTheme}
                onMenuToggle={handleMenuToggle}
                sidebarOpen={sidebarOpen}
                basePath={basePath}
                onSetDirectory={setDirectory}
                readingSettings={readingSettings}
                onReadingSettingsChange={handleReadingSettingsChange}
                focusMode={focusMode}
                onFocusModeToggle={handleFocusModeToggle}
            />

            <div className="app-container">
                {/* Show sidebar only if not in Focus Mode */}
                {!focusMode && (
                    hasUploadedFiles ? (
                        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                            <DropZone
                                onFilesLoaded={handleFilesLoaded}
                                uploadedFiles={uploadedFiles}
                                selectedFilePath={selectedUploadedFile?.path ?? null}
                                onSelectFile={handleSelectUploadedFile}
                                onClearFiles={handleClearFiles}
                            />
                        </aside>
                    ) : (
                        <Sidebar
                            files={files}
                            selectedFile={selectedFile}
                            onSelectFile={selectFile}
                            isOpen={sidebarOpen}
                            onClose={handleSidebarClose}
                            currentPath={currentPath}
                            basePath={basePath}
                            onGoBack={goBack}
                        />
                    )
                )}

                <main className="main-content">
                    {/* Floating FAB to exit Focus Mode on screen if topbar is hidden/minimal */}
                    {focusMode && (
                        <button
                            className="exit-focus-fab"
                            onClick={handleFocusModeToggle}
                            title="الخروج من وضع التركيز"
                        >
                            <Eye size={16} />
                            <span>الخروج من وضع التركيز</span>
                        </button>
                    )}

                    <div className="content-wrapper">
                        {error && (
                            <div className="error-message">
                                <span>⚠️ {error}</span>
                            </div>
                        )}

                        {showDropZone ? (
                            <DropZone
                                onFilesLoaded={handleFilesLoaded}
                                uploadedFiles={[]}
                                selectedFilePath={null}
                                onSelectFile={() => { }}
                                onClearFiles={() => { }}
                            />
                        ) : (
                            <MarkdownViewer
                                content={displayContent}
                                loading={loading}
                                theme={theme}
                                fileName={displayFileName}
                                readingSettings={readingSettings}
                                onImageClick={handleImageClick}
                            />
                        )}
                    </div>
                </main>

                {/* Outline (Table of Contents) sidebar, if document content exists */}
                {displayContent && !showDropZone && (
                    <Outline
                        content={displayContent}
                        isOpen={outlineOpen && !focusMode}
                        onToggle={handleOutlineToggle}
                        dir={docDirection}
                    />
                )}
            </div>

            {/* Premium Fullscreen Glassmorphism Lightbox Overlay */}
            {zoomImage && (
                <div className="lightbox-overlay" onClick={() => setZoomImage(null)}>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <button
                            className="lightbox-close-btn"
                            onClick={() => setZoomImage(null)}
                            title="إغلاق"
                        >
                            <X size={24} />
                        </button>
                        <div className="lightbox-image-wrapper">
                            <img src={zoomImage.url} alt={zoomImage.alt} className="lightbox-image" />
                        </div>
                        {zoomImage.alt && (
                            <div className="lightbox-caption-bar" dir="auto">
                                <p>{zoomImage.alt}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
