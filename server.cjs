const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Store current browsing path
let currentBasePath = '';

/**
 * Validate path to prevent directory traversal attacks
 */
function isValidPath(filePath) {
    if (!currentBasePath) return false;

    const resolvedPath = path.resolve(filePath);
    const resolvedBase = path.resolve(currentBasePath);

    return resolvedPath.startsWith(resolvedBase);
}

/**
 * GET /api/set-path
 * Set the base directory to browse
 */
app.post('/api/set-path', (req, res) => {
    const { dirPath } = req.body;

    if (!dirPath) {
        return res.status(400).json({ error: 'Directory path is required' });
    }

    const resolvedPath = path.resolve(dirPath);

    if (!fs.existsSync(resolvedPath)) {
        return res.status(404).json({ error: 'Directory not found' });
    }

    if (!fs.statSync(resolvedPath).isDirectory()) {
        return res.status(400).json({ error: 'Path is not a directory' });
    }

    currentBasePath = resolvedPath;
    console.log(`Base path set to: ${currentBasePath}`);

    res.json({ success: true, path: currentBasePath });
});

/**
 * GET /api/files
 * List all markdown files in the current directory and subdirectories
 */
app.get('/api/files', (req, res) => {
    const relativePath = req.query.path || '';

    if (!currentBasePath) {
        return res.status(400).json({ error: 'No directory set. Use POST /api/set-path first.' });
    }

    const targetPath = path.join(currentBasePath, relativePath);

    if (!isValidPath(targetPath)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    if (!fs.existsSync(targetPath)) {
        return res.status(404).json({ error: 'Path not found' });
    }

    try {
        const items = fs.readdirSync(targetPath, { withFileTypes: true });

        const files = items
            .filter(item => {
                // Include directories and .md files
                return item.isDirectory() || item.name.toLowerCase().endsWith('.md');
            })
            .map(item => ({
                name: item.name,
                isDirectory: item.isDirectory(),
                path: path.join(relativePath, item.name).replace(/\\/g, '/'),
            }))
            .sort((a, b) => {
                // Directories first, then files
                if (a.isDirectory && !b.isDirectory) return -1;
                if (!a.isDirectory && b.isDirectory) return 1;
                return a.name.localeCompare(b.name);
            });

        res.json({
            currentPath: relativePath || '/',
            basePath: currentBasePath,
            files,
        });
    } catch (err) {
        console.error('Error reading directory:', err);
        res.status(500).json({ error: 'Failed to read directory' });
    }
});

/**
 * GET /api/file
 * Read a specific markdown file
 */
app.get('/api/file', (req, res) => {
    const filePath = req.query.path;

    if (!filePath) {
        return res.status(400).json({ error: 'File path is required' });
    }

    if (!currentBasePath) {
        return res.status(400).json({ error: 'No directory set. Use POST /api/set-path first.' });
    }

    const fullPath = path.join(currentBasePath, filePath);

    if (!isValidPath(fullPath)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    if (!fullPath.toLowerCase().endsWith('.md')) {
        return res.status(400).json({ error: 'Only markdown files are allowed' });
    }

    try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        res.json({ content, path: filePath });
    } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).json({ error: 'Failed to read file' });
    }
});

/**
 * GET /api/current-path
 * Get the current base path
 */
app.get('/api/current-path', (req, res) => {
    res.json({ path: currentBasePath || null });
});

app.listen(PORT, () => {
    console.log(`📂 File server running on http://localhost:${PORT}`);
    console.log('Ready to browse markdown files!');
});
