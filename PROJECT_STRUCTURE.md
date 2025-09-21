# Project Structure Documentation

This document outlines the organized structure of the Bhuvesh portfolio project after refactoring.

## 📁 Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/
│   ├── resume/
│   ├── services/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/             # Reusable React components
│   ├── layout/            # Layout components
│   │   ├── Navigation.tsx
│   │   └── index.ts
│   ├── sections/          # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── index.ts
│   ├── ui/                # UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Section.tsx
│   │   ├── Loading.tsx
│   │   ├── SVG.tsx
│   │   └── index.ts
│   └── index.ts
├── lib/                   # Utility functions and data
│   └── data.ts           # Static data and constants
├── types/                 # TypeScript type definitions
│   └── index.ts
└── assets/               # Static assets
    └── icons/            # Icon assets (if needed)
```

## 🧩 Component Architecture

### UI Components (`/components/ui/`)

**Button Component**

- Props: `variant`, `size`, `onClick`, `className`, `type`, `disabled`
- Variants: `primary`, `secondary`, `outline`
- Sizes: `sm`, `md`, `lg`

**Card Component**

- Props: `children`, `className`, `hover`
- Provides consistent card styling with backdrop blur and borders

**Section Component**

- Props: `children`, `className`, `id`
- Wrapper for page sections with consistent styling

**Loading Component**

- Props: `message`, `subMessage`
- Animated loading screen with particles and orbital rings

**SVG Component**

- Base SVG component with customizable props
- Includes predefined icons: Menu, Close, GitHub, LinkedIn, Twitter, Email, Location, etc.
- Extracted SVGs from public folder: File, Globe, NextJS, Vercel, Window

### Layout Components (`/components/layout/`)

**Navigation Component**

- Props: `activeSection`, `onSectionClick`
- Responsive navigation with mobile menu
- Handles both hash links and regular links

### Section Components (`/components/sections/`)

**HeroSection**

- Props: `onGetStarted`, `onViewProjects`
- Main landing section with call-to-action buttons

**AboutSection**

- Displays personal information and skills
- Uses data from `lib/data.ts`

**ProjectsSection**

- Shows portfolio projects
- Uses data from `lib/data.ts`

**ContactSection**

- Contact form and information
- Uses SVG icons for contact methods

## 📊 Data Management

### Data File (`/lib/data.ts`)

Centralized data storage for:

- `projects`: Portfolio projects
- `blogPosts`: Blog articles
- `experience`: Work experience
- `education`: Educational background
- `certifications`: Professional certifications
- `skills`: Technical skills organized by category
- `services`: Offered services
- `process`: Development process steps
- `testimonials`: Client testimonials
- `skillsList`: Simple skills array for About section

## 🎨 Type Definitions (`/types/index.ts`)

Comprehensive TypeScript interfaces for:

- Navigation items
- Projects, blog posts, experience, education
- Services, process steps, testimonials
- Component props (Button, Card, Section, SVG)
- Contact form data
- Loading component props

## 🔧 Key Features

### 1. **Modular Architecture**

- Components are organized by purpose (UI, layout, sections)
- Easy to maintain and extend
- Clear separation of concerns

### 2. **Type Safety**

- Comprehensive TypeScript definitions
- Props validation for all components
- IntelliSense support for better development experience

### 3. **Reusable Components**

- SVG component with predefined icons
- Consistent button and card components
- Flexible section wrapper

### 4. **Data Centralization**

- All static data in one place
- Easy to update content
- Type-safe data structures

### 5. **Responsive Design**

- Mobile-first approach
- Responsive navigation with mobile menu
- Flexible grid layouts

## 🚀 Usage Examples

### Using the SVG Component

```tsx
import { Icons } from '@/components/ui';

// Using predefined icons
<Icons.GitHub className="w-6 h-6" />
<Icons.Email className="w-5 h-5" fill="currentColor" />

// Using base SVG component
<SVG viewBox="0 0 24 24" className="w-6 h-6">
  <path d="..." />
</SVG>
```

### Using UI Components

```tsx
import { Button, Card, Section } from '@/components/ui';

<Section id="about" className="py-20">
  <Card>
    <Button variant="primary" size="lg" onClick={handleClick}>
      Get Started
    </Button>
  </Card>
</Section>;
```

### Using Data

```tsx
import { projects, skills } from '@/lib/data';

// Use in components
{
  projects.map((project) => <ProjectCard key={project.id} project={project} />);
}
```

## 📝 Benefits of This Structure

1. **Maintainability**: Clear organization makes it easy to find and update code
2. **Scalability**: Easy to add new components and features
3. **Reusability**: Components can be used across different pages
4. **Type Safety**: TypeScript ensures code quality and catches errors early
5. **Performance**: Optimized imports and component structure
6. **Developer Experience**: Clear patterns and consistent naming

## 🔄 Migration Notes

- All hardcoded data moved to `lib/data.ts`
- SVG files extracted from public folder and converted to React components
- Navigation logic centralized in Navigation component
- Loading screen extracted to reusable component
- Page sections broken down into individual components

This structure provides a solid foundation for future development and makes the codebase much more maintainable and scalable.
