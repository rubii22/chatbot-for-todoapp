# Todo App Frontend

A responsive, secure todo application frontend built with Next.js 16+, TypeScript, and Tailwind CSS.

## Features

- User authentication (signup/login)
- Task management (create, read, update, delete)
- Responsive design for mobile and desktop
- JWT-based authentication
- Clean, modern UI with Tailwind CSS

## Tech Stack

- Next.js 16+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- SWR for data fetching
- Better Auth for authentication

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Variables

Create a `.env.local` file in the frontend directory and add the following:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Project Structure

```text
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout with global styles
│   │   ├── page.tsx         # Home page
│   │   ├── auth/            # Authentication pages
│   │   └── dashboard/       # Dashboard pages
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base UI components
│   │   ├── auth/            # Authentication components
│   │   ├── tasks/           # Task management components
│   │   └── layout/          # Layout components
│   ├── lib/                 # Utility functions
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.js
```

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)