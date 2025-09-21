# Bhuvesh Portfolio

A modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Component Architecture**: Modular, reusable React components
- **Performance Optimized**: Fast loading with Turbopack
- **SEO Ready**: Optimized for search engines
- **Accessibility**: WCAG compliant design

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Custom CSS animations
- **Build Tool**: Turbopack
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
│   ├── ui/                # UI components (Button, Card, Section, Loading, SVG)
│   ├── layout/            # Layout components (Navigation)
│   └── sections/          # Page sections (Hero, About, Projects, Contact)
├── lib/                   # Utility functions and data
├── styles/                # Custom CSS styles
├── types/                 # TypeScript type definitions
└── assets/               # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/bhuve1996/bhuvesh.git
cd bhuvesh
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[Project Structure](./docs/PROJECT_STRUCTURE.md)** - Detailed project organization
- **[Development Guidelines](./.cursorrules)** - Coding standards and best practices
- **[Styles Documentation](./docs/styles-README.md)** - CSS organization and animations
- **[Component Documentation](./docs/components/README.md)** - Component usage and guidelines

## 🎨 Customization

### Adding New Components

1. Create component in appropriate directory (`ui/`, `layout/`, or `sections/`)
2. Define TypeScript interfaces in `types/index.ts`
3. Add component to index file for easy imports
4. Update documentation

### Styling

- Use Tailwind CSS classes
- Add custom animations in `styles/loading-animations.css`
- Follow the established color scheme (cyan-400, blue-500)
- Maintain responsive design principles

### Data Management

- Store static data in `lib/data.ts`
- Use TypeScript interfaces for type safety
- Keep data separate from components

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms

The project can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Bhuvesh Singla**

- GitHub: [@bhuve1996](https://github.com/bhuve1996)
- Portfolio: [bhuvesh.dev](https://bhuvesh.dev)

---

Built with ❤️ using Next.js and modern web technologies.
