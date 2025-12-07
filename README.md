<p align="center">
  <img src="public/favicon.svg" alt="Midad Logo" width="100" height="100">
</p>

<h1 align="center">مِداد | Midad</h1>

<p align="center">
  <strong>A Modern Markdown Reader with Excellent Arabic RTL Support</strong>
</p>

<p align="center">
  <em>قارئ ماركداون عصري مع دعم ممتاز للغة العربية واتجاه RTL</em>
</p>

<p align="center">
  <a href="https://midad.vercel.app">🌐 Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#tech-stack">Tech Stack</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

---

## ✨ Features

### 🌍 **Intelligent RTL/LTR Support**
- **Automatic Direction Detection**: Per-paragraph, per-heading RTL/LTR detection
- **Mixed Content**: Seamlessly handles documents with both Arabic and English content
- **Arabic Typography**: Optimized fonts and line-height for Arabic text (Noto Sans Arabic)

### 🎨 **Beautiful Design**
- **Glassmorphism UI**: Modern glass-effect design with smooth transitions
- **Dark/Light Themes**: Toggle between elegantly crafted themes
- **Responsive Layout**: Perfect experience on desktop and mobile devices
- **Smooth Animations**: Fade-in transitions for content loading

### 📝 **Rich Markdown Rendering**
- **GitHub Flavored Markdown (GFM)**: Tables, task lists, strikethrough, and more
- **Syntax Highlighting**: Beautiful code blocks with Prism.js (One Dark/Light themes)
- **Raw HTML Support**: Render embedded HTML within Markdown

### 📁 **File System Browser**
- **Demo Mode**: Built-in sample files showcase all features (on Vercel)
- **Local File Access**: Browse and read Markdown files from your local file system
- **Folder Navigation**: Navigate through directories with ease

---

## 🚀 Quick Start

### Try it Online

👉 **[midad.vercel.app](https://midad.vercel.app)** - Live demo with sample files

### Run Locally

```bash
# Clone the repository
git clone https://github.com/dzgreeno/Midad.git
cd Midad

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### With Local File System Access

```bash
# Run the backend server for file system browsing
node server.cjs
```

Then open `http://localhost:3000`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **react-markdown** | Markdown Parsing |
| **remark-gfm** | GitHub Flavored Markdown |
| **react-syntax-highlighter** | Code Highlighting |
| **Lucide React** | Icons |
| **Express.js** | Backend Server (optional) |

---

## 📁 Project Structure

```
Midad/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # React components
│   │   ├── MarkdownViewer.tsx
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── useMarkdownFiles.ts
│   ├── utils/               # Utility functions
│   │   ├── detectDirection.ts
│   │   ├── demoContent.ts   # Demo files for Vercel
│   │   └── fileLoader.ts
│   ├── App.tsx
│   └── App.css
├── server.cjs               # Express server
└── package.json
```

---

## 🌐 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dzgreeno/Midad)

The demo mode automatically activates when the backend is unavailable.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/dzgreeno">dzgreeno</a>
</p>

<p align="center">
  <sub>مِداد - من الكلمة العربية التي تعني "الحبر"، رمز للكتابة والمعرفة</sub>
</p>
