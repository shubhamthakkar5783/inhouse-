import React from 'react';
import Icon from '../../../components/AppIcon';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'email',
      label: 'Email Invitations',
      icon: 'Mail',
      description: 'Generated invitation emails'
    },
    {
      id: 'social',
      label: 'Social Media',
      icon: 'Share2',
      description: 'Platform-specific captions'
    },
    {
      id: 'visual',
      label: 'Visual Assets',
      icon: 'Image',
      description: 'Posters, banners & graphics'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-1 mb-6">
      <div className="flex flex-col sm:flex-row">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => onTabChange(tab?.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab?.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon 
              name={tab?.icon} 
              size={16} 
              className={activeTab === tab?.id ? 'text-primary-foreground' : 'text-muted-foreground'} 
            />
            <div className="flex flex-col items-start">
              <span>{tab?.label}</span>
              <span className={`text-xs ${
                activeTab === tab?.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}>
                {tab?.description}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;