# Movie Explorer

A Next.js application for exploring movies with user authentication and favorites functionality.

## Project Structure

```
movie-explorer/
├── src/
│   ├── app/                 # App Router pages
│   │   ├── api/             # API routes
│   │   │   └── auth/        # Authentication API
│   │   ├── favorites/       # Favorites page
│   │   ├── login/           # Login page
│   │   ├── movie/[id]/      # Movie detail page
│   │   ├── movies/          # Movies listing page
│   │   ├── signup/          # Signup page
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable UI components
│   ├── config/              # Configuration files
│   ├── contexts/            # React context providers
│   ├── models/              # Database models
│   ├── services/            # Service layers
│   └── types/               # TypeScript types
├── .env.local              # Environment variables
├── package.json            # Project dependencies
└── ...
```

## Features

1. **User Authentication**
   - Sign up and login functionality
   - Protected routes for authenticated users

2. **Movie Browsing**
   - Browse popular movies
   - Search for specific movies
   - View detailed movie information

3. **Favorites Management**
   - Add/remove movies to favorites
   - View all favorite movies
   - Persistent storage (localStorage for non-authenticated users, MongoDB for authenticated users)

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: MongoDB with Mongoose
- **Authentication**: bcryptjs for password hashing
- **API**: TMDB (The Movie Database) API

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## API Routes

- `/api/auth` - Authentication API endpoint handling:
  - User registration
  - User login
  - Favorites management

## Database Models

- **User**: Stores user information and favorite movies
- **Movie**: Stores movie information from TMDB

## Context Providers

- **AuthContext**: Manages user authentication state
- **FavoritesContext**: Manages user favorites state

## Components

- **Header**: Navigation header with auth controls
- **MovieCard**: Displays movie information in a card format
- **FavoriteButton**: Toggle button for adding/removing favorites
- **ProtectedRoute**: Wrapper for protected pages
- **Skeleton Loaders**: Loading placeholders for better UX

## Services

- **tmdbService**: Functions for interacting with TMDB API
- **authService**: Functions for authentication and favorites management

## Types

- **movie.ts**: TypeScript interfaces for movie data structures

## Development

The application follows Next.js App Router conventions with:
- Server-side rendering for better SEO
- Client-side components for interactive features
- API routes for backend functionality
- Context API for state management