# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Seattle LMS is a Learning Management System built as a Turbo monorepo with client-server architecture. The client uses Xatom framework with Webflow integration, while the server provides GraphQL APIs with Apollo Server.

## Architecture

- **Client** (`apps/client/`): Frontend built with Xatom framework, integrates with Webflow
- **Server** (`apps/server/`): Node.js/Express backend with Apollo GraphQL server
- **ORM Package** (`packages/orm/`): Prisma-based database layer with MongoDB and TypeGraphQL code generation
- **Client Utils** (`packages/client-utils/`): Shared frontend utilities and components
- **TypeScript Config** (`packages/tsconfig/`): Shared TypeScript configuration

## Development Commands

### Root Level Commands
- `yarn dev` - Start all services in development mode
- `yarn build` - Build all applications and packages
- `yarn client:dev` - Start only client development server
- `yarn server:start` - Start only server application
- `yarn client:gen` - Generate GraphQL types for client
- `yarn db:gen` - Generate Prisma client and TypeGraphQL schemas
- `yarn db:push` - Push database schema changes
- `yarn db:pull` - Pull database schema from remote
- `yarn db:show` - Open Prisma Studio database browser

### Client-Specific Commands
- `xatom dev` - Start Xatom development server (port 3021)
- `xatom build` - Build client for production
- `graphql-codegen --config app-codegen.yml` - Generate GraphQL types

### Server-Specific Commands
- `nodemon` - Start server in development mode with auto-reload
- `tsc && node ./dist/index.js` - Build and start production server

### Database Commands
- `prisma generate && yarn build` - Generate Prisma client and build ORM package
- `prisma studio` - Open database management interface

## Technology Stack

### Client
- **Xatom**: Frontend framework for Webflow integration
- **Apollo GraphQL**: Client-side GraphQL with code generation
- **HTMX**: HTML over the wire functionality
- **Swiper**: Touch slider component
- **Day.js**: Date manipulation library

### Server
- **Express**: Web server framework
- **Apollo Server**: GraphQL server implementation
- **Prisma**: Database ORM with MongoDB
- **TypeGraphQL**: GraphQL schema generation from TypeScript
- **JWT**: Authentication tokens
- **AWS SDK**: File storage integration
- **Google Analytics**: Analytics data integration
- **Bcrypt**: Password hashing
- **Node-cron**: Scheduled tasks

### Database
- **MongoDB**: Document database
- **Prisma**: ORM with TypeGraphQL code generation
- Models: User, Admin, Course, Lesson, CourseProgress, LessonProgress, OTP, Location data

## Key File Structure

- `apps/client/src/modules/` - Client-side page modules (admin/public split)
- `apps/server/src/modules/graphql/` - GraphQL resolvers (admin/public split)
- `apps/server/src/modules/services/` - Business logic services
- `packages/orm/prisma/schema.prisma` - Database schema definition
- `packages/orm/generated/` - Auto-generated Prisma client and TypeGraphQL types

## Development Workflow

1. Database changes: Update `schema.prisma` → run `yarn db:gen` → update resolvers
2. Client changes: Update modules → run `yarn client:gen` if GraphQL queries change
3. Server changes: Update resolvers/services → restart with `nodemon`

## Environment Configuration

- Uses `dotenv-cli` for environment variable loading
- Turbo.json defines build pipeline with caching
- Workspaces enable shared dependencies and cross-package development

## Authentication Architecture

- Dual authentication system for admin and public users
- JWT token-based authentication with refresh token versioning
- Google OAuth integration available
- OTP-based verification for signup/login/password reset