import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/event-planning-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Event planning overview and AI generation hub'
    },
    {
      label: 'Event Plan',
      path: '/event-plan-details',
      icon: 'Calendar',
      tooltip: 'Detailed timeline and agenda management'
    },
    {
      label: 'Tasks',
      path: '/task-board-management',
      icon: 'CheckSquare',
      tooltip: 'Visual task board and progress tracking'
    },
    {
      label: 'Budget',
      path: '/budget-calculator',
      icon: 'Calculator',
      tooltip: 'Dynamic cost calculation and financial planning'
    },
    {
      label: 'Marketing',
      path: '/marketing-materials',
      icon: 'Megaphone',
      tooltip: 'AI-generated promotional content and assets'
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/login');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-1000 bg-card border-b border-border shadow-card">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/event-planning-dashboard" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Icon name="Sparkles" size={20} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground">Smart Event</span>
                <span className="text-xs text-muted-foreground -mt-1">Planner</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => {
              const isActive = isActivePath(item?.path);
              return (
                <div key={item?.path} className="relative group">
                  <a
                    href={item?.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                      isActive
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.label}</span>
                  </a>
                  <div className="opacity-0 group-hover:opacity-100 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-1300 bg-card border border-border rounded shadow-card px-3 py-2 text-xs text-foreground whitespace-nowrap pointer-events-none transition-opacity duration-200">
                    {item?.tooltip}
                  </div>
                </div>
              );
            })}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                iconName="LogOut"
                className="ml-2"
              >
                Logout
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
          </Button>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-1100 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu} />
          <div className="fixed top-0 right-0 w-80 h-full bg-card shadow-modal animate-slide-in">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <Icon name="Sparkles" size={20} color="white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-foreground">Smart Event</span>
                  <span className="text-xs text-muted-foreground -mt-1">Planner</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobileMenu}
                aria-label="Close mobile menu"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            <nav className="p-6">
              <div className="space-y-2">
                {navigationItems?.map((item) => {
                  const isActive = isActivePath(item?.path);
                  return (
                    <a
                      key={item?.path}
                      href={item?.path}
                      onClick={closeMobileMenu}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-smooth ${
                        isActive
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={item?.icon} size={20} />
                      <div className="flex flex-col">
                        <span>{item?.label}</span>
                        <span className="text-xs opacity-75">{item?.tooltip}</span>
                      </div>
                    </a>
                  );
                })}
                {user && (
                  <Button
                    variant="destructive"
                    fullWidth
                    onClick={handleLogout}
                    iconName="LogOut"
                    className="mt-4"
                  >
                    Logout
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;