import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionButton = ({ onAction, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const getContextualActions = () => {
    const currentPath = location?.pathname;
    
    switch (currentPath) {
      case '/task-board-management':
        return [
          { 
            icon: 'Plus', 
            label: 'Add Task', 
            action: 'add-task',
            color: 'bg-primary hover:bg-primary/90'
          },
          { 
            icon: 'Users', 
            label: 'Assign Team', 
            action: 'assign-team',
            color: 'bg-secondary hover:bg-secondary/90'
          }
        ];
      
      case '/budget-calculator':
        return [
          { 
            icon: 'DollarSign', 
            label: 'Add Expense', 
            action: 'add-expense',
            color: 'bg-primary hover:bg-primary/90'
          },
          { 
            icon: 'Download', 
            label: 'Export Budget', 
            action: 'export-budget',
            color: 'bg-accent hover:bg-accent/90'
          }
        ];
      
      case '/marketing-materials':
        return [
          { 
            icon: 'Sparkles', 
            label: 'Generate Content', 
            action: 'generate-content',
            color: 'bg-primary hover:bg-primary/90'
          },
          { 
            icon: 'Download', 
            label: 'Download Assets', 
            action: 'download-assets',
            color: 'bg-accent hover:bg-accent/90'
          }
        ];
      
      case '/event-plan-details':
        return [
          { 
            icon: 'Calendar', 
            label: 'Add Event', 
            action: 'add-event',
            color: 'bg-primary hover:bg-primary/90'
          },
          { 
            icon: 'Clock', 
            label: 'Set Reminder', 
            action: 'set-reminder',
            color: 'bg-warning hover:bg-warning/90'
          }
        ];
      
      default: // Dashboard and other pages
        return [
          { 
            icon: 'Sparkles', 
            label: 'AI Generate', 
            action: 'ai-generate',
            color: 'bg-primary hover:bg-primary/90'
          },
          { 
            icon: 'Plus', 
            label: 'Quick Add', 
            action: 'quick-add',
            color: 'bg-secondary hover:bg-secondary/90'
          }
        ];
    }
  };

  const actions = getContextualActions();
  const primaryAction = actions?.[0];

  const handleActionClick = (actionType) => {
    if (onAction) {
      onAction(actionType);
    }
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-1000 ${className}`}>
      {/* Expanded Actions */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 space-y-2 animate-slide-in">
          {actions?.slice(1)?.map((action, index) => (
            <Button
              key={action?.action}
              onClick={() => handleActionClick(action?.action)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-modal text-white ${action?.color} transition-smooth hover:scale-105`}
              size="sm"
            >
              <Icon name={action?.icon} size={16} />
              <span className="text-sm font-medium">{action?.label}</span>
            </Button>
          ))}
        </div>
      )}
      {/* Main Action Button */}
      <div className="flex items-center space-x-2">
        {/* Expand/Collapse Button */}
        {actions?.length > 1 && (
          <Button
            onClick={toggleExpanded}
            className="w-12 h-12 rounded-full bg-muted hover:bg-muted/80 shadow-modal transition-smooth hover:scale-105"
            size="icon"
            aria-label={isExpanded ? "Collapse actions" : "Show more actions"}
          >
            <Icon 
              name={isExpanded ? "X" : "MoreHorizontal"} 
              size={20} 
              className="text-muted-foreground"
            />
          </Button>
        )}

        {/* Primary Action Button */}
        <Button
          onClick={() => handleActionClick(primaryAction?.action)}
          className={`w-14 h-14 rounded-full shadow-modal text-white ${primaryAction?.color} transition-smooth hover:scale-105 hover:shadow-lg`}
          size="icon"
          aria-label={primaryAction?.label}
        >
          <Icon name={primaryAction?.icon} size={24} />
        </Button>
      </div>
      {/* Tooltip for Primary Action */}
      <div className="absolute bottom-16 right-0 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {primaryAction?.label}
        </div>
      </div>
    </div>
  );
};

export default QuickActionButton;