import { useState, useCallback, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, FolderOpen, X } from 'lucide-react';

interface UploadedFile {
    name: string;
    content: string;
    path: string;
}

interface DropZoneProps {
    onFilesLoaded: (files: UploadedFile[]) => void;
    uploadedFiles: UploadedFile[];
    selectedFilePath: string | null;
    onSelectFile: (file: UploadedFile) => void;
    onClearFiles: () => void;
}

export function DropZone({
    onFilesLoaded,
    uploadedFiles,
    selectedFilePath,
    onSelectFile,
    onClearFiles
}: DropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);

    const processFiles = useCallback(async (fileList: FileList | File[]) => {
        setIsLoading(true);
        const files = Array.from(fileList);
        const markdownFiles: UploadedFile[] = [];

        for (const file of files) {
            // Only process .md files
            if (file.name.toLowerCase().endsWith('.md')) {
                try {
                    const content = await file.text();
                    markdownFiles.push({
                        name: file.name.replace('.md', ''),
                        content,
                        path: file.webkitRelativePath || file.name
                    });
                } catch (err) {
                    console.error(`Failed to read file: ${file.name}`, err);
                }
            }
        }

        if (markdownFiles.length > 0) {
            onFilesLoaded(markdownFiles);
        }
        setIsLoading(false);
    }, [onFilesLoaded]);

    const handleDragEnter = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(async (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const items = e.dataTransfer.items;
        const files: File[] = [];

        // Handle both files and folders
        const processEntry = async (entry: FileSystemEntry): Promise<void> => {
            if (entry.isFile) {
                const fileEntry = entry as FileSystemFileEntry;
                return new Promise((resolve) => {
                    fileEntry.file((file) => {
                        // Create a new File with the full path
                        const fileWithPath = new File([file], file.name, { type: file.type });
                        Object.defineProperty(fileWithPath, 'webkitRelativePath', {
                            value: entry.fullPath.slice(1), // Remove leading slash
                            writable: false
                        });
                        files.push(fileWithPath);
                        resolve();
                    });
                });
            } else if (entry.isDirectory) {
                const dirEntry = entry as FileSystemDirectoryEntry;
                const reader = dirEntry.createReader();
                return new Promise((resolve) => {
                    reader.readEntries(async (entries) => {
                        for (const subEntry of entries) {
                            await processEntry(subEntry);
                        }
                        resolve();
                    });
                });
            }
        };

        if (items) {
            const entries: FileSystemEntry[] = [];
            for (let i = 0; i < items.length; i++) {
                const entry = items[i].webkitGetAsEntry();
                if (entry) {
                    entries.push(entry);
                }
            }

            for (const entry of entries) {
                await processEntry(entry);
            }
        }

        if (files.length > 0) {
            await processFiles(files);
        } else {
            // Fallback for browsers that don't support webkitGetAsEntry
            const droppedFiles = e.dataTransfer.files;
            if (droppedFiles.length > 0) {
                await processFiles(droppedFiles);
            }
        }
    }, [processFiles]);

    const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
        // Reset input so same file can be selected again
        e.target.value = '';
    }, [processFiles]);

    const handleFolderSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
        e.target.value = '';
    }, [processFiles]);

    // If files are uploaded, show file list instead of drop zone
    if (uploadedFiles.length > 0) {
        return (
            <div className="uploaded-files-panel">
                <div className="uploaded-files-header">
                    <h3>
                        <FileText size={18} />
                        الملفات المحملة ({uploadedFiles.length})
                    </h3>
                    <button
                        className="clear-files-btn"
                        onClick={onClearFiles}
                        title="مسح الملفات"
                    >
                        <X size={16} />
                    </button>
                </div>
                <ul className="uploaded-file-list">
                    {uploadedFiles.map((file, index) => (
                        <li key={`${file.path}-${index}`}>
                            <button
                                className={`uploaded-file-btn ${selectedFilePath === file.path ? 'active' : ''}`}
                                onClick={() => onSelectFile(file)}
                            >
                                <FileText size={16} />
                                <span className="file-name">{file.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="add-more-files">
                    <button
                        className="add-files-btn"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload size={14} />
                        إضافة ملفات
                    </button>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </div>
        );
    }

    return (
        <div
            className={`drop-zone ${isDragging ? 'dragging' : ''} ${isLoading ? 'loading' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="drop-zone-content">
                <Upload className="drop-zone-icon" />
                <h3>اسحب وأفلت ملفات Markdown هنا</h3>
                <p>أو</p>
                <div className="drop-zone-buttons">
                    <button
                        className="pick-files-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                    >
                        <FileText size={18} />
                        اختر ملفات
                    </button>
                    <button
                        className="pick-folder-btn"
                        onClick={() => folderInputRef.current?.click()}
                        disabled={isLoading}
                    >
                        <FolderOpen size={18} />
                        اختر مجلد
                    </button>
                </div>
                <p className="drop-zone-hint">يدعم ملفات .md فقط</p>
            </div>

            {/* Hidden file inputs */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".md"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
            <input
                ref={folderInputRef}
                type="file"
                accept=".md"
                multiple
                onChange={handleFolderSelect}
                style={{ display: 'none' }}
                {...{ webkitdirectory: '', directory: '' } as any}
            />
        </div>
    );
}
