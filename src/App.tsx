import { useState, useCallback } from 'react';
import { Topbar, Sidebar, MarkdownViewer, DropZone } from './components';
import { useMarkdownFiles, useTheme } from './hooks';
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

    // State for uploaded files (drag & drop / file picker)
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [selectedUploadedFile, setSelectedUploadedFile] = useState<UploadedFile | null>(null);

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

    // Determine what content to show
    const displayContent = selectedUploadedFile?.content ?? content;
    const displayFileName = selectedUploadedFile?.name ?? selectedFile?.name;
    const hasUploadedFiles = uploadedFiles.length > 0;

    // Show DropZone in main content when in demo mode and no uploaded files
    const showDropZone = isDemoMode && !selectedFile && !hasUploadedFiles;

    return (
        <div className="app">
            <Topbar
                theme={theme}
                onThemeToggle={toggleTheme}
                onMenuToggle={handleMenuToggle}
                sidebarOpen={sidebarOpen}
                basePath={basePath}
                onSetDirectory={setDirectory}
            />

            <div className="app-container">
                {/* Show uploaded files panel or regular sidebar */}
                {hasUploadedFiles ? (
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
                )}

                <main className="main-content">
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
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;

