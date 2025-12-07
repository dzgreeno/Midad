import { useState, useCallback } from 'react';
import { Topbar, Sidebar, MarkdownViewer } from './components';
import { useMarkdownFiles, useTheme } from './hooks';
import './App.css';

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
        setDirectory
    } = useMarkdownFiles();
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleMenuToggle = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const handleSidebarClose = useCallback(() => {
        setSidebarOpen(false);
    }, []);

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

                <main className="main-content">
                    <div className="content-wrapper">
                        {error && (
                            <div className="error-message">
                                <span>⚠️ {error}</span>
                            </div>
                        )}
                        <MarkdownViewer
                            content={content}
                            loading={loading}
                            theme={theme}
                            fileName={selectedFile?.name}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
