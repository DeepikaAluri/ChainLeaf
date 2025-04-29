import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Leaf, BarChart2, QrCode, Car as Farm, ScanLine, LogOut, Menu, X, History } from 'lucide-react';
import { useState } from 'react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    return null;
  }

  const isAdmin = user.role === 'admin';
  const isDistributor = user.role === 'distributor';
  const isConsumer = user.role === 'consumer';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: <BarChart2 size={20} /> },
    { path: '/admin/batches', label: 'Batches', icon: <Leaf size={20} /> },
    { path: '/admin/qr-codes', label: 'QR Codes', icon: <QrCode size={20} /> },
    { path: '/admin/farms', label: 'Farms', icon: <Farm size={20} /> },
  ];

  const distributorNavItems = [
    { path: '/distributor', label: 'Dashboard', icon: <BarChart2 size={20} /> },
    { path: '/distributor/scan', label: 'Scan QR', icon: <ScanLine size={20} /> },
  ];

  const consumerNavItems = [
    { path: '/consumer', label: 'Dashboard', icon: <BarChart2 size={20} /> },
    { path: '/verify', label: 'Verify Product', icon: <ScanLine size={20} /> },
    { path: '/history', label: 'History', icon: <History size={20} /> },
  ];

  const navItems = isAdmin 
    ? adminNavItems 
    : isDistributor 
    ? distributorNavItems 
    : isConsumer 
    ? consumerNavItems 
    : [];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-700" />
            <h1 className="text-xl font-bold text-gray-900">ChainLeaf</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Supply Chain Tracker</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </a>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/profile')}
              className="group flex items-center flex-1"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 group-hover:bg-green-200">
                {user.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 group-hover:text-green-700">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
          >
            <LogOut size={18} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Leaf className="h-7 w-7 text-green-700" />
            <h1 className="ml-2 text-lg font-bold text-gray-900">ChainLeaf</h1>
          </div>
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-white border-b border-gray-200 p-4 space-y-2">
            <button
              onClick={() => {
                navigate('/profile');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 text-sm rounded-lg hover:bg-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                {user.name.charAt(0)}
              </div>
              <div className="ml-3 text-left">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </button>
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </a>
            ))}
            <div className="pt-2 border-t border-gray-200 mt-2">
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-3 text-sm text-red-600 rounded-lg hover:bg-red-50"
              >
                <LogOut size={18} />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 md:p-8 p-4 md:pt-8 pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;