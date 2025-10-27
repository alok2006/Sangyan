// src/components/Layout.tsx
import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  hideNavbar?: boolean;
  className?: string;
}

/**
 * Layout component that wraps pages with Navbar
 * Note: Footer is removed to prevent duplication since pages handle their own footers
 */
const Layout = ({ 
  children, 
  hideNavbar = false,
  className = '' 
}: LayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;
