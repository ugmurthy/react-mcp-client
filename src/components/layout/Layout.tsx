import React from 'react';
import Header from './Header';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-content">{children}</main>
    </div>
  );
};

export default Layout;