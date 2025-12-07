import type { MarkdownFile } from '../types';

export interface DemoFile {
    id: string;
    name: string;
    path: string;
    content: string;
}

/**
 * Demo files to showcase Midad's capabilities when running without a backend
 */
export const demoFiles: DemoFile[] = [
    {
        id: 'welcome',
        name: 'مرحباً بك',
        path: '/demo/welcome.md',
        content: `# مرحباً بك في مِداد! 👋

**مِداد** هو قارئ ملفات Markdown عصري وأنيق، مصمم خصيصاً لدعم اللغة العربية واتجاه RTL بشكل ممتاز.

## ✨ المميزات الرئيسية

### 🌍 دعم ذكي للاتجاه
- **كشف تلقائي**: يتم تحديد اتجاه كل فقرة وعنوان تلقائياً
- **محتوى مختلط**: دعم سلس للمستندات التي تحتوي على عربي وإنجليزي معاً
- **خطوط محسنة**: استخدام خط Noto Sans Arabic للنص العربي

### 🎨 تصميم جميل
- **واجهة زجاجية**: تصميم Glassmorphism حديث
- **وضعان للعرض**: داكن وفاتح
- **تصميم متجاوب**: تجربة ممتازة على الحاسوب والجوال

### 📝 عرض Markdown غني
- دعم **GitHub Flavored Markdown**
- تلوين الأكواد البرمجية
- الجداول والقوائم
- الاقتباسات والروابط

---

> 💡 **نصيحة**: جرب تبديل الوضع بين الداكن والفاتح بالضغط على أيقونة الشمس/القمر في الأعلى!

---

## جرب الملفات الأخرى

اختر ملفاً من القائمة الجانبية لاستكشاف المزيد من الأمثلة:
- **Code Examples**: أمثلة على الأكواد البرمجية
- **Tables & Lists**: جداول وقوائم

---

صُنع بـ ❤️ بواسطة [dzgreeno](https://github.com/dzgreeno)
`
    },
    {
        id: 'code-examples',
        name: 'Code Examples',
        path: '/demo/code-examples.md',
        content: `# Code Syntax Highlighting

Midad supports beautiful syntax highlighting for many programming languages.

## JavaScript / TypeScript

\`\`\`typescript
interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}

async function fetchUser(id: string): Promise<User> {
    const response = await fetch(\`/api/users/\${id}\`);
    if (!response.ok) {
        throw new Error('User not found');
    }
    return response.json();
}

// Usage
const user = await fetchUser('123');
console.log(\`Hello, \${user.name}!\`);
\`\`\`

## Python

\`\`\`python
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class Article:
    title: str
    content: str
    author: str
    tags: List[str]
    published: bool = False

def search_articles(query: str, articles: List[Article]) -> List[Article]:
    """Search articles by title or content."""
    query = query.lower()
    return [
        article for article in articles
        if query in article.title.lower() 
        or query in article.content.lower()
    ]
\`\`\`

## CSS

\`\`\`css
.glassmorphism {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
\`\`\`

## Inline Code

You can also use \`inline code\` like this: \`const x = 42;\`

---

## Mixed RTL/LTR Content

هذا مثال على دمج الكود مع النص العربي:

\`\`\`javascript
// دالة لتحية المستخدم
function greet(name) {
    return \`مرحباً يا \${name}!\`;
}

greet('أحمد'); // مرحباً يا أحمد!
\`\`\`
`
    },
    {
        id: 'tables-lists',
        name: 'Tables & Lists',
        path: '/demo/tables-lists.md',
        content: `# Tables & Lists | الجداول والقوائم

## Tables | الجداول

### Features Comparison

| Feature | Midad | Others |
|---------|-------|--------|
| RTL Support | ✅ Excellent | ⚠️ Limited |
| Dark Mode | ✅ Yes | ✅ Yes |
| Arabic Typography | ✅ Optimized | ❌ Basic |
| Syntax Highlighting | ✅ Beautiful | ✅ Yes |
| Responsive | ✅ Fully | ⚠️ Partial |

### جدول بالعربية

| الميزة | الوصف | الحالة |
|--------|-------|--------|
| دعم RTL | اتجاه من اليمين لليسار | ✅ مكتمل |
| الوضع الداكن | تبديل بين الفاتح والداكن | ✅ مكتمل |
| تلوين الأكواد | Prism.js مع One Dark | ✅ مكتمل |
| الخطوط العربية | Noto Sans Arabic | ✅ مكتمل |

---

## Lists | القوائم

### Unordered List

- First item
- Second item
  - Nested item 1
  - Nested item 2
    - Deep nested
- Third item

### Ordered List

1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

### Task List

- [x] Create Midad project
- [x] Add RTL support
- [x] Implement dark mode
- [x] Add syntax highlighting
- [ ] World domination 🌍

### قائمة بالعربية

- العنصر الأول
- العنصر الثاني
  - عنصر فرعي ١
  - عنصر فرعي ٢
- العنصر الثالث

---

## Blockquotes | الاقتباسات

> This is a blockquote in English. It demonstrates how Midad handles quoted text with proper styling.

> هذا اقتباس باللغة العربية. يوضح كيف يتعامل مِداد مع النص المقتبس مع التنسيق المناسب والاتجاه الصحيح.

### Nested Blockquote

> Level 1 quote
>> Level 2 quote
>>> Level 3 quote

---

## Horizontal Rules

Above is a horizontal rule (---).

***

This one uses (***).

___

And this uses (___).
`
    }
];

/**
 * Convert demo files to the file list format
 */
export function getDemoFileList(): { name: string; isDirectory: boolean; path: string }[] {
    return demoFiles.map(file => ({
        name: file.name,
        isDirectory: false,
        path: file.path
    }));
}

/**
 * Get demo file content by path
 */
export function getDemoFileContent(path: string): string | null {
    const file = demoFiles.find(f => f.path === path);
    return file?.content ?? null;
}

/**
 * Convert demo file to MarkdownFile format
 */
export function toDemoMarkdownFile(file: DemoFile): MarkdownFile {
    return {
        id: file.id,
        name: file.name,
        path: file.path
    };
}
