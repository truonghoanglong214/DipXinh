
# DịpXinh

DịpXinh là nền tảng SaaS multi-tenant hỗ trợ các cửa hàng thời trang quản lý hoạt động bán và cho thuê trang phục.

## 1. Core Features

- Multi-tenant shop management
- Authentication and role-based access control
- Product catalog and variants
- Rental inventory with QR codes
- Rental booking and availability management
- Sale orders and checkout
- Payment and deposit management
- Returns, inspections and incidents
- SaaS subscriptions
- Notifications and reporting

## 2. Technology Stack

### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- Flyway
- Maven

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query

### Infrastructure
- Docker Compose
- Nginx
- GitHub Actions
- VPS deployment

## 3. Architecture

Backend: Modular Monolith + Pragmatic Clean Architecture.

Frontend: Feature-Based Architecture.

Database: PostgreSQL shared schema with tenant isolation.

## 4. Repository Structure

- backend/  : Spring Boot application
- frontend/ : React application
- infra/    : Deployment configurations
- docs/     : Business and technical documents
- .github/  : GitHub automation

## 5. Development Setup

Project initialization is in progress.

Backend setup instructions will be added after B01-02.

Frontend setup instructions will be added during the frontend phases.

## 6. Git Conventions

Main branch:
- main: stable integration branch

Working branches:
- feat/<task-id>-description
- fix/<task-id>-description
- chore/<task-id>-description

Commit message convention:
- feat: new feature
- fix: bug fix
- refactor: code restructuring
- test: tests
- docs: documentation
- chore: tooling or configuration

Examples:
- feat(booking): implement rental hold
- fix(finance): prevent duplicate refunds
- test(booking): cover concurrent allocations
- chore(repo): initialize monorepo structure

## 7. Current Status

Development is starting with Backend Foundation.

See docs/planning for the development handbook
and project tracking documents.
