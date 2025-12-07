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
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#license">License</a>
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

### 📝 **Rich Markdown Rendering**
- **GitHub Flavored Markdown (GFM)**: Tables, task lists, strikethrough, and more
- **Syntax Highlighting**: Beautiful code blocks with Prism.js (One Dark/Light themes)
- **Raw HTML Support**: Render embedded HTML within Markdown

### 📁 **File System Browser**
- **Local File Access**: Browse and read Markdown files from your local file system
- **Folder Navigation**: Navigate through directories with ease
- **Real-time Updates**: Watch for file changes (when running with server)

---

## 🖥️ Demo

<p align="center">
  <img src="https://via.placeholder.com/800x450?text=Midad+Dark+Mode" alt="Dark Mode Preview" width="45%">
  <img src="https://via.placeholder.com/800x450?text=Midad+Light+Mode" alt="Light Mode Preview" width="45%">
</p>

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/Midad.git

# Navigate to the project
cd Midad

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### With Local File System Access

To browse files from your local file system, start the backend server:

```bash
# Run with Express server (for file system access)
node server.cjs
```

Then open `http://localhost:3000`

---

## 📖 Usage

### Basic Usage
1. **Open the App**: Navigate to the application URL
2. **Set Directory**: Enter a folder path containing Markdown files
3. **Browse Files**: Select files from the sidebar to view
4. **Toggle Theme**: Click the moon/sun icon to switch themes

### Keyboard Shortcuts
| Action | Shortcut |
|--------|----------|
| Toggle Theme | Click theme button |
| Toggle Sidebar | Click menu button (mobile) |

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
│   └── favicon.svg          # App icon
├── src/
│   ├── components/
│   │   ├── MarkdownViewer.tsx   # Main Markdown renderer
│   │   ├── Sidebar.tsx          # File navigation sidebar
│   │   ├── Topbar.tsx           # Top navigation bar
│   │   └── index.ts             # Component exports
│   ├── hooks/
│   │   ├── useMarkdownFiles.ts  # File management hook
│   │   └── useTheme.ts          # Theme management hook
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   ├── utils/
│   │   └── detectDirection.ts   # RTL/LTR detection
│   ├── App.tsx                  # Main application
│   ├── App.css                  # Application styles
│   ├── index.css                # Global styles & CSS variables
│   └── main.tsx                 # Entry point
├── server.cjs                   # Express server for file access
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🌐 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/Midad)

1. Click the button above or visit [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Deploy with default settings

> **Note**: The Vercel deployment runs the frontend only. For file system access, run the server locally or use a different hosting solution.

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React Markdown](https://github.com/remarkjs/react-markdown) for Markdown rendering
- [Prism.js](https://prismjs.com/) for syntax highlighting
- [Lucide](https://lucide.dev/) for beautiful icons
- [Google Fonts](https://fonts.google.com/) for Noto Sans Arabic & Inter fonts

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/dzgreeno">dzgreeno</a>
</p>

<p align="center">
  <sub>مِداد - من الكلمة العربية التي تعني "الحبر"، رمز للكتابة والمعرفة</sub>
</p>
