export interface MarkdownFile {
    id: string;
    name: string;
    path: string;
    content?: string;
}

export type Theme = 'light' | 'dark';

export type Direction = 'rtl' | 'ltr';

export interface AppState {
    selectedFile: MarkdownFile | null;
    files: MarkdownFile[];
    theme: Theme;
    sidebarOpen: boolean;
    loading: boolean;
}

export interface ReadingSettings {
    fontFamily: 'sans' | 'serif' | 'tajawal' | 'system';
    fontSize: 'sm' | 'md' | 'lg' | 'xl';
    lineHeight: 'tight' | 'normal' | 'spacious';
    pageWidth: 'narrow' | 'normal' | 'wide';
    layoutStyle: 'scroll' | 'book';
}

