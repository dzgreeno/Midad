import { FileText, Folder, FolderOpen, ArrowLeft } from 'lucide-react';
import type { FileItem } from '../utils/fileLoader';

interface SidebarProps {
    files: FileItem[];
    selectedFile: { id: string; name: string; path: string } | null;
    onSelectFile: (file: FileItem) => void;
    isOpen: boolean;
    onClose: () => void;
    currentPath: string;
    basePath: string | null;
    onGoBack: () => void;
}

export function Sidebar({
    files,
    selectedFile,
    onSelectFile,
    isOpen,
    onClose,
    currentPath,
    basePath,
    onGoBack
}: SidebarProps) {
    const handleFileClick = (file: FileItem) => {
        onSelectFile(file);
        // Close sidebar on mobile after selection (only for files, not folders)
        if (!file.isDirectory && window.innerWidth <= 768) {
            onClose();
        }
    };

    const canGoBack = currentPath && currentPath !== '/' && currentPath !== '';

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">
                        <FolderOpen />
                        الملفات
                    </h2>
                    {basePath && (
                        <div className="current-path" title={basePath}>
                            {basePath.split('\\').pop() || basePath}
                        </div>
                    )}
                </div>

                {/* Back button and current folder */}
                {canGoBack && (
                    <button className="back-button" onClick={onGoBack}>
                        <ArrowLeft />
                        <span>رجوع</span>
                    </button>
                )}

                {currentPath && currentPath !== '/' && (
                    <div className="breadcrumb">
                        📁 {currentPath}
                    </div>
                )}

                <nav aria-label="File navigation">
                    <ul className="file-list" role="list">
                        {files.map((file, index) => (
                            <li key={`${file.path}-${index}`} className="file-item">
                                <button
                                    className={`file-button ${!file.isDirectory && selectedFile?.path === file.path ? 'active' : ''} ${file.isDirectory ? 'folder' : ''}`}
                                    onClick={() => handleFileClick(file)}
                                    aria-current={selectedFile?.path === file.path ? 'page' : undefined}
                                >
                                    {file.isDirectory ? <Folder /> : <FileText />}
                                    <span className="file-name">{file.name}</span>
                                </button>
                            </li>
                        ))}

                        {files.length === 0 && basePath && (
                            <li className="file-item">
                                <p style={{
                                    padding: 'var(--space-md)',
                                    color: 'var(--color-text-muted)',
                                    fontSize: 'var(--text-sm)',
                                    textAlign: 'center'
                                }}>
                                    لا توجد ملفات Markdown
                                </p>
                            </li>
                        )}

                        {!basePath && (
                            <li className="file-item">
                                <p style={{
                                    padding: 'var(--space-md)',
                                    color: 'var(--color-text-muted)',
                                    fontSize: 'var(--text-sm)',
                                    textAlign: 'center'
                                }}>
                                    اختر مجلداً للبدء
                                </p>
                            </li>
                        )}
                    </ul>
                </nav>
            </aside>
        </>
    );
}
