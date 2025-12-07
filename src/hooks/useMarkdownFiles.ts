import { useState, useEffect, useCallback } from 'react';
import { getFileList, loadFileContent, setBasePath, getCurrentPath, toMarkdownFile } from '../utils/fileLoader';
import { getDemoFileList, getDemoFileContent, demoFiles, toDemoMarkdownFile } from '../utils/demoContent';
import type { FileItem } from '../utils/fileLoader';
import type { MarkdownFile, Theme } from '../types';

interface UseMarkdownFilesReturn {
    files: FileItem[];
    selectedFile: MarkdownFile | null;
    content: string | null;
    loading: boolean;
    error: string | null;
    currentPath: string;
    basePath: string | null;
    selectFile: (file: FileItem) => void;
    navigateToFolder: (path: string) => void;
    goBack: () => void;
    setDirectory: (path: string) => Promise<void>;
    isDemoMode: boolean;
}

export function useMarkdownFiles(): UseMarkdownFilesReturn {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<MarkdownFile | null>(null);
    const [content, setContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPath, setCurrentPath] = useState('');
    const [basePath, setBasePathState] = useState<string | null>(null);
    const [isDemoMode, setIsDemoMode] = useState(false);

    // Initialize demo mode with first file selected
    const initDemoMode = useCallback(() => {
        setIsDemoMode(true);
        setFiles(getDemoFileList());
        setCurrentPath('/demo');
        setBasePathState('/demo');
        // Auto-select first demo file
        if (demoFiles.length > 0) {
            const firstFile = demoFiles[0];
            setSelectedFile(toDemoMarkdownFile(firstFile));
            setContent(firstFile.content);
        }
    }, []);

    // Load files when path changes
    const loadFiles = useCallback(async (relativePath: string = '') => {
        if (isDemoMode) return;
        if (!basePath) return;

        setLoading(true);
        setError(null);

        try {
            const response = await getFileList(relativePath);
            setFiles(response.files);
            setCurrentPath(response.currentPath);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load files');
            setFiles([]);
        } finally {
            setLoading(false);
        }
    }, [basePath, isDemoMode]);

    // Check for existing base path on mount, fall back to demo mode if backend unavailable
    useEffect(() => {
        const checkCurrentPath = async () => {
            try {
                const path = await getCurrentPath();
                if (path) {
                    setBasePathState(path);
                } else {
                    // No backend available, switch to demo mode
                    initDemoMode();
                }
            } catch {
                // Backend not available, switch to demo mode
                initDemoMode();
            }
        };
        checkCurrentPath();
    }, [initDemoMode]);

    // Load files when base path is set (non-demo mode)
    useEffect(() => {
        if (basePath && !isDemoMode) {
            loadFiles('');
        }
    }, [basePath, loadFiles, isDemoMode]);

    // Load content when selected file changes
    useEffect(() => {
        if (!selectedFile) {
            setContent(null);
            return;
        }

        // In demo mode, get content from demo files
        if (isDemoMode) {
            const demoContent = getDemoFileContent(selectedFile.path);
            if (demoContent) {
                setContent(demoContent);
            }
            return;
        }

        const loadContent = async () => {
            setLoading(true);
            setError(null);

            try {
                const fileContent = await loadFileContent(selectedFile.path);
                setContent(fileContent);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load file content');
                setContent(null);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [selectedFile, isDemoMode]);

    const selectFile = useCallback((file: FileItem) => {
        if (file.isDirectory) {
            // Navigate into folder
            loadFiles(file.path);
            setSelectedFile(null);
            setContent(null);
        } else {
            // In demo mode, find the demo file
            if (isDemoMode) {
                const demoFile = demoFiles.find(f => f.path === file.path);
                if (demoFile) {
                    setSelectedFile(toDemoMarkdownFile(demoFile));
                }
            } else {
                // Select markdown file
                setSelectedFile(toMarkdownFile(file, 0));
            }
        }
    }, [loadFiles, isDemoMode]);

    const navigateToFolder = useCallback((path: string) => {
        loadFiles(path);
        setSelectedFile(null);
        setContent(null);
    }, [loadFiles]);

    const goBack = useCallback(() => {
        if (currentPath && currentPath !== '/') {
            const parentPath = currentPath.split('/').slice(0, -1).join('/');
            loadFiles(parentPath);
            setSelectedFile(null);
            setContent(null);
        }
    }, [currentPath, loadFiles]);

    const setDirectory = useCallback(async (path: string) => {
        setLoading(true);
        setError(null);

        try {
            const result = await setBasePath(path);
            setBasePathState(result.path);
            setSelectedFile(null);
            setContent(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to set directory');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        files,
        selectedFile,
        content,
        loading,
        error,
        currentPath,
        basePath,
        selectFile,
        navigateToFolder,
        goBack,
        setDirectory,
        isDemoMode,
    };
}

interface UseThemeReturn {
    theme: Theme;
    toggleTheme: () => void;
}

export function useTheme(): UseThemeReturn {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark' || stored === 'light') {
            return stored;
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }, []);

    return { theme, toggleTheme };
}
