'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-green-800 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl text-white">MOVIE EXPLORER</span>
            </Link>
            {isAuthenticated && user && (
              <nav className="ml-6 flex space-x-8">
                <Link
                  href="/movies"
                  className={`${
                    pathname === '/movies'
                      ? 'text-green-300 nav-link active'
                      : 'text-green-500 hover:text-green-500 nav-link'
                  } inline-flex items-center px-1 pt-1 text-sm font-medium`}
                >
                  MOVIES
                </Link>
                <Link
                  href="/favorites"
                  className={`${
                    pathname === '/favorites'
                      ? 'text-green-300 nav-link active'
                      : 'text-green-300 hover:text-green-500 nav-link'
                  } inline-flex items-center px-1 pt-1 text-sm font-medium`}
                >
                  MY FAVORITES
                </Link>
              </nav>
            )}
          </div>
          {!isAuthenticated ? (
            <div className="flex items-center">
              <Link
                href="/login"
                className="text-green-300 hover:text-green-500 text-sm font-medium"
              >
                LOGIN
              </Link>
              <Link
                href="/signup"
                className="ml-4 text-green-300 hover:text-green-500 text-sm font-medium"
              >
                SIGN UP
              </Link>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="mr-4 text-sm text-green-300 hidden md:block">
                Hello, {user ? user.name : 'User'}
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-green-400 hover:text-green-500"
              >
                LOGOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}