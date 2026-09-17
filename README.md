# Decathlon - TP React

This project is initialized with vite and react router.

## Librairies used
- @vtmn-play
    - Decathlon components library
- react-hook-form
    - Form handling
- zod
    - Validation
- tailwind
    - CSS Framework
- classnames
    - Class utils
- @tanstack/react-query
    - Request managment and caching
- oxlint and oxfmt
    - Lint and format

## Architecture
Minimalist architecture based on features (without a specific folder /features), with specific components inside releative features/folders.
Split components to have a maintenable and reproductible environment, but no over splitting, to follow DRY and KISS principles. Within this specific "simple" project, not need to overthink and overcomplicate everything.

## Routing - React Router
This project use React Router with Framework Mode with SPA rendering.
Using Route definitions and multiple middlewares:
- Simple auth middleware to authenticate a user
- Role middleware to authenticate an admin user
    - For product and accounts route.

## Contexts and state managements
State management are handled within specific contexts with query and data mutation inside.
Exporting a provider to be used withing pages.

## Fake Store API
Fake Store API give a fake e-commerce store API that doesn't persist data.

So there is specific choices in the app according to this constraint.

Tanstack Query mutations uses setQueryData instead of invalidateQueries for two reasons.
- Invalidate queries will trigger a new get and erase "persistent" actions like create, update or delete.
- In this case, we have all the necessary data to update the data and have up to date data. No need to impose a charge to the server. (In a real environment, this should be a decision to take. If server consistency matters, rely on invalidateQueries.)

---

# Start the project
# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
pnpm install
```

### Development

Start the development server with HMR:

```bash
pnpm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
pnpm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
