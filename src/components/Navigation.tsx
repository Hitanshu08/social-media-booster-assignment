import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Menu, X } from 'lucide-react';
import { brandAssets } from '../lib/brandAssets';
import { BrandImage } from './BrandImage';

export function Navigation() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="navbar-surface sticky top-0 z-50 border-b border-[var(--surface-overlay-light)] shadow-lg px-4 sm:px-6 lg:px-8"
      aria-label="Primary"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between py-4 md:py-0 md:h-20">
          <div className="flex items-center gap-3 md:gap-8">
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <BrandImage
                src={brandAssets.logo.src}
                fallbackSrc={brandAssets.logo.fallbackSrc}
                alt="Social Booster Media"
                className="h-8 w-auto"
              />
            </Link>

            <div className="hidden md:flex items-center gap-2 md:ml-8">
              <Link
                to="/"
                aria-current={isActive('/') && !isActive('/campaigns') ? 'page' : undefined}
                className={`px-4 py-2 transition-colors flex items-center gap-2 font-medium ${
                  isActive('/') && !isActive('/campaigns')
                    ? 'text-white'
                    : 'text-[var(--color-muted-gray)] hover:text-white'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/campaigns"
                aria-current={isActive('/campaigns') ? 'page' : undefined}
                className={`px-4 py-2 transition-colors flex items-center gap-2 font-medium ${
                  isActive('/campaigns')
                    ? 'text-white'
                    : 'text-[var(--color-muted-gray)] hover:text-white'
                }`}
              >
                <Megaphone className="h-4 w-4" />
                Campaigns
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://socialboostermedia.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit Social Booster Media (opens in a new tab)"
              className="btn-primary btn-sm hidden md:inline-flex"
            >
              Visit site
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="btn-primary btn-icon md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                aria-current={isActive('/') && !isActive('/campaigns') ? 'page' : undefined}
                className={`px-4 py-2 transition-colors flex items-center gap-2 font-medium ${
                  isActive('/') && !isActive('/campaigns')
                    ? 'text-white'
                    : 'text-[var(--color-muted-gray)] hover:text-white'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/campaigns"
                onClick={() => setMenuOpen(false)}
                aria-current={isActive('/campaigns') ? 'page' : undefined}
                className={`px-4 py-2 transition-colors flex items-center gap-2 font-medium ${
                  isActive('/campaigns')
                    ? 'text-white'
                    : 'text-[var(--color-muted-gray)] hover:text-white'
                }`}
              >
                <Megaphone className="h-4 w-4" />
                Campaigns
              </Link>
              <a
                href="https://socialboostermedia.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Visit Social Booster Media (opens in a new tab)"
                className="btn-primary btn-sm w-full justify-center"
              >
                Visit site
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}