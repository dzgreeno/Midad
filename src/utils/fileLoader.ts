import type { MarkdownFile } from '../types';

const API_BASE = 'http://localhost:3001/api';

export interface FileItem {
  name: string;
  isDirectory: boolean;
  path: string;
}

export interface FilesResponse {
  currentPath: string;
  basePath: string;
  files: FileItem[];
}

/**
 * Set the base directory to browse
 */
export async function setBasePath(dirPath: string): Promise<{ success: boolean; path: string }> {
  try {
    const response = await fetch(`${API_BASE}/set-path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dirPath }),
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('الخادم غير متصل. تأكد من تشغيل: node server.cjs');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'فشل في تعيين المسار');
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('الخادم غير متصل. تأكد من تشغيل: node server.cjs');
    }
    throw error;
  }
}

/**
 * Get the current base path
 */
export async function getCurrentPath(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE}/current-path`);
    const data = await response.json();
    return data.path;
  } catch {
    return null;
  }
}

/**
 * Gets the list of files in the current directory
 */
export async function getFileList(relativePath: string = ''): Promise<FilesResponse> {
  const response = await fetch(`${API_BASE}/files?path=${encodeURIComponent(relativePath)}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to load files');
  }

  return response.json();
}

/**
 * Loads the content of a markdown file
 */
export async function loadFileContent(filePath: string): Promise<string> {
  const response = await fetch(`${API_BASE}/file?path=${encodeURIComponent(filePath)}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to load file');
  }

  const data = await response.json();
  return data.content;
}

/**
 * Convert FileItem to MarkdownFile for compatibility
 */
export function toMarkdownFile(item: FileItem, index: number): MarkdownFile {
  return {
    id: `file-${index}`,
    name: item.name.replace('.md', ''),
    path: item.path,
  };
}
