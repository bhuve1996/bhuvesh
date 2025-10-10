.PHONY: help install install-dev format lint type-check test clean run dev-setup

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install production dependencies
	pip install -r requirements.txt

install-dev: ## Install development dependencies
	pip install -e ".[dev]"
	pre-commit install

dev-setup: install-dev ## Complete development setup
	@echo "Development environment setup complete!"
	@echo "Run 'make format' to format your code"
	@echo "Run 'make lint' to check for issues"
	@echo "Run 'make type-check' to check types"
	@echo "Run 'make test' to run tests"

format: ## Format code with black and isort
	black .
	isort .

lint: ## Run ruff linter
	ruff check .

lint-fix: ## Run ruff linter and fix issues
	ruff check --fix .

type-check: ## Run mypy type checker
	mypy .

test: ## Run tests
	pytest

test-verbose: ## Run tests with verbose output
	pytest -v

clean: ## Clean up cache files
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf .pytest_cache
	rm -rf .mypy_cache
	rm -rf .ruff_cache

run: ## Run the FastAPI server
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

check-all: format lint type-check test ## Run all checks (format, lint, type-check, test)

# Pre-commit hooks
pre-commit-install: ## Install pre-commit hooks
	pre-commit install

pre-commit-run: ## Run pre-commit on all files
	pre-commit run --all-files

# Docker commands (if you add Docker later)
docker-build: ## Build Docker image
	docker build -t resume-analyzer-backend .

docker-run: ## Run Docker container
	docker run -p 8000:8000 resume-analyzer-backend
