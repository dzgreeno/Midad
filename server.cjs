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
 * Resolve a local image path from markdown to an absolute filesystem path.
 * Handles file:// protocol, URL-encoded characters, Windows drive letters.
 */
function resolveImagePath(imgPath, mdFileDir) {
    let cleanPath = imgPath.replace(/^file:\/\/\/?/, '');
    try {
        cleanPath = decodeURIComponent(cleanPath);
    } catch (e) { /* ignore decode errors */ }

    // Normalize leading slash on Windows: /d:/web -> d:/web
    cleanPath = cleanPath.replace(/^\/([a-zA-Z]:)/, '$1');

    if (path.isAbsolute(cleanPath) || /^[a-zA-Z]:/.test(cleanPath)) {
        return path.resolve(cleanPath);
    }

    // Relative path – resolve from the markdown file's own directory
    return path.resolve(mdFileDir, cleanPath);
}

/**
 * Scan markdown content for image references and embed local ones as
 * base64 data URIs – exactly the way VS Code / Obsidian handle local images.
 * This completely bypasses browser security restrictions.
 */
function embedLocalImages(markdownContent, mdFileDir) {
    const MIME_TYPES = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.bmp': 'image/bmp',
    };

    // Match standard markdown images: ![alt](path)
    return markdownContent.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        (match, alt, imgPath) => {
            // Skip images that are already http/https/data/blob URLs
            if (/^https?:\/\/|^data:|^blob:/.test(imgPath)) {
                return match;
            }

            try {
                const resolved = resolveImagePath(imgPath, mdFileDir);
                if (!fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
                    console.warn(`[Image Embed] File not found: ${resolved}`);
                    return match;
                }

                const ext = path.extname(resolved).toLowerCase();
                const mime = MIME_TYPES[ext];
                if (!mime) {
                    console.warn(`[Image Embed] Unsupported type: ${ext}`);
                    return match;
                }

                const data = fs.readFileSync(resolved);
                const b64 = data.toString('base64');
                console.log(`[Image Embed] ✔ ${path.basename(resolved)} (${(data.length / 1024).toFixed(1)} KB)`);
                return `![${alt}](data:${mime};base64,${b64})`;
            } catch (e) {
                console.warn(`[Image Embed] Failed: ${imgPath} – ${e.message}`);
                return match;
            }
        }
    );
}

/**
 * GET /api/file
 * Read a specific markdown file, embedding local images as base64 data URIs.
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
        let content = fs.readFileSync(fullPath, 'utf-8');

        // Embed local images as base64 data URIs
        console.log(`[Image Embed] Scanning ${path.basename(fullPath)} for local images...`);
        content = embedLocalImages(content, path.dirname(fullPath));

        res.json({ content, path: filePath });
    } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).json({ error: 'Failed to read file' });
    }
});

/**
 * GET /api/media
 * Serves a local media file (image) by streaming it.
 * Decodes path and checks if it's absolute or relative to base path.
 */
app.get('/api/media', (req, res) => {
    const filePath = req.query.path;

    if (!filePath) {
        return res.status(400).json({ error: 'File path is required' });
    }

    try {
        console.log(`[Media Proxy] Requested path: ${filePath}`);
        // Clean prefix "file:///" or "file://"
        let cleanPath = filePath.replace(/^file:\/\/\/?/, '');
        cleanPath = decodeURIComponent(cleanPath);
        
        // Normalize leading slash on Windows: /d:/web -> d:/web
        cleanPath = cleanPath.replace(/^\/([a-zA-Z]:)/, '$1');

        let resolvedPath;
        if (path.isAbsolute(cleanPath) || /^[a-zA-Z]:/.test(cleanPath)) {
            resolvedPath = path.resolve(cleanPath);
        } else {
            if (!currentBasePath) {
                return res.status(400).json({ error: 'No base path set' });
            }
            resolvedPath = path.resolve(path.join(currentBasePath, cleanPath));
        }

        console.log(`[Media Proxy] Resolved path: ${resolvedPath}`);
        
        // Check if file exists
        if (!fs.existsSync(resolvedPath)) {
            console.warn(`[Media Proxy] File not found: ${resolvedPath}`);
            return res.status(404).json({ error: 'File not found: ' + resolvedPath });
        }

        // Check if it's a directory
        if (fs.statSync(resolvedPath).isDirectory()) {
            return res.status(400).json({ error: 'Path is a directory' });
        }

        // Send the file
        res.sendFile(resolvedPath);
    } catch (err) {
        console.error('Error serving media file:', err);
        res.status(500).json({ error: 'Failed to serve media file' });
    }
});

/**
 * GET /api/current-path
 * Get the current base path
 */
app.get('/api/current-path', (req, res) => {
    res.json({ path: currentBasePath || null });
});

// Serve static frontend files from 'dist' directory if it exists
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    console.log(`[Server] Serving static frontend from: ${distPath}`);
    
    // Support SPA routing (redirect all non-API GET requests to index.html)
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api')) {
            return res.sendFile(path.join(distPath, 'index.html'));
        }
        next();
    });
}

app.listen(PORT, () => {
    console.log(`📂 File server running on http://localhost:${PORT}`);
    console.log('Ready to browse markdown files!');
});
