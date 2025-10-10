# Development Guide

## Project Overview
This is a full-stack portfolio website with an ATS (Applicant Tracking System) resume analyzer. The project consists of a Next.js frontend and a FastAPI backend with Google Gemini AI integration.

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Build Tool**: Turbopack
- **Toast Notifications**: react-hot-toast

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **AI Integration**: Google Gemini AI
- **File Processing**: PyPDF2, python-docx
- **ML Libraries**: sentence-transformers, scikit-learn
- **Linting**: Ruff, Black, isort
- **Type Checking**: MyPy

## Project Structure

```
├── src/                    # Frontend source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   │   ├── ui/           # UI components
│   │   ├── layout/       # Layout components
│   │   └── sections/     # Page sections
│   ├── lib/              # Utility functions and data
│   ├── types/            # TypeScript type definitions
│   └── assets/           # Static assets
├── backend/               # Backend source code
│   ├── app/              # FastAPI application
│   │   ├── api/          # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utility functions
│   │   └── types/        # Type definitions
│   ├── docs/             # Documentation
│   └── tests/            # Test files
├── docs/                  # Project documentation
└── public/               # Static files
```

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Git

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload

# Run tests
pytest

# Run linting
ruff check .
black .
isort .
mypy .
```

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
ENVIRONMENT=development
DEBUG=true
```

## Development Workflow

### 1. Feature Development
- Create a feature branch from main
- Implement changes following coding standards
- Write tests for new functionality
- Update documentation if needed
- Submit pull request for review

### 2. Code Quality
- Run linting before committing
- Use pre-commit hooks
- Maintain code coverage
- Follow TypeScript/Python best practices

### 3. Testing
- Write unit tests for all functions
- Test error cases and edge cases
- Use proper mocking for external dependencies
- Maintain test coverage above 80%

## Coding Standards

### TypeScript/React
- Use functional components with hooks
- Define proper prop types
- Use TypeScript strict mode
- Follow component naming conventions
- Use absolute imports with `@/`

### Python/FastAPI
- Follow PEP 8 guidelines
- Use type hints for all functions
- Use docstrings for documentation
- Implement proper error handling
- Use async/await for I/O operations

### File Organization
- Keep related files together
- Use clear, descriptive names
- Group components by functionality
- Separate concerns (UI, logic, data)

## Component Guidelines

### UI Components
- Make components reusable and configurable
- Use consistent prop interfaces
- Provide sensible defaults
- Support className overrides

### API Endpoints
- Use proper HTTP status codes
- Implement request/response validation
- Handle errors gracefully
- Document endpoints with OpenAPI

## Error Handling

### Frontend
- Use error boundaries for React components
- Implement proper loading states
- Show user-friendly error messages
- Use toast notifications for feedback

### Backend
- Use proper HTTP status codes
- Provide meaningful error messages
- Log errors appropriately
- Handle edge cases gracefully

## Performance Considerations

### Frontend
- Use dynamic imports for large components
- Optimize images and assets
- Implement proper caching
- Minimize re-renders

### Backend
- Use async/await for I/O operations
- Implement proper caching
- Optimize database queries
- Monitor performance metrics

## Security

### Frontend
- Sanitize user inputs
- Use proper authentication
- Follow Next.js security best practices
- Keep dependencies updated

### Backend
- Validate all inputs
- Sanitize file uploads
- Use proper authentication
- Follow security best practices

## Deployment

### Frontend
- Deploy to Vercel or similar platform
- Use environment variables for configuration
- Enable automatic deployments from main branch

### Backend
- Deploy to Railway, Heroku, or similar platform
- Use environment variables for configuration
- Enable automatic deployments from main branch

## Monitoring and Logging

### Frontend
- Use proper error tracking
- Monitor performance metrics
- Track user interactions
- Log errors to external service

### Backend
- Use proper logging configuration
- Monitor API performance
- Track error rates
- Log to external service

## Documentation

### Code Documentation
- Use docstrings for all functions
- Document complex logic
- Keep README files updated
- Document API endpoints

### User Documentation
- Provide clear setup instructions
- Document all features
- Include troubleshooting guides
- Keep documentation current

## Troubleshooting

### Common Issues
- Check environment variables
- Verify dependencies are installed
- Check for port conflicts
- Review error logs

### Getting Help
- Check project documentation
- Review error messages
- Search existing issues
- Create new issue if needed

## Contributing

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Update documentation
6. Submit pull request

### Code Review
- Review code for quality and standards
- Check for security issues
- Verify tests pass
- Ensure documentation is updated

## Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [Cursor](https://cursor.sh/)
- [Postman](https://www.postman.com/)
- [Git](https://git-scm.com/)

Remember: Focus on clean, maintainable code with proper error handling and documentation. The project should be robust, secure, and performant.
