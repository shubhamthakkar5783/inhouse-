import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GeneratedContentCard = ({ 
  title, 
  description, 
  icon, 
  status = 'pending', 
  progress = 0,
  onView,
  onEdit,
  onDownload,
  lastUpdated,
  items = []
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'in-progress':
        return 'text-primary';
      case 'pending':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return 'CheckCircle2';
      case 'in-progress':
        return 'Clock';
      case 'pending':
        return 'Circle';
      default:
        return 'Circle';
    }
  };

  const getProgressColor = () => {
    if (progress >= 100) return 'bg-success';
    if (progress >= 50) return 'bg-primary';
    if (progress >= 25) return 'bg-warning';
    return 'bg-muted-foreground';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card hover:shadow-modal transition-smooth">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name={icon} size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name={getStatusIcon()} size={16} className={getStatusColor()} />
          <span className={`text-xs font-medium capitalize ${getStatusColor()}`}>
            {status?.replace('-', ' ')}
          </span>
        </div>
      </div>
      {/* Progress Bar */}
      {progress > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-medium text-foreground">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {/* Content Preview */}
      {items?.length > 0 && (
        <div className="mb-4">
          <div className="space-y-2">
            {items?.slice(0, 3)?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <Icon name="ChevronRight" size={12} className="text-muted-foreground" />
                <span className="text-muted-foreground truncate">{item}</span>
              </div>
            ))}
            {items?.length > 3 && (
              <div className="text-xs text-muted-foreground pl-4">
                +{items?.length - 3} more items
              </div>
            )}
          </div>
        </div>
      )}
      {/* Last Updated */}
      {lastUpdated && (
        <div className="mb-4 text-xs text-muted-foreground">
          <Icon name="Clock" size={12} className="inline mr-1" />
          Updated {new Date(lastUpdated)?.toLocaleDateString()}
        </div>
      )}
      {/* Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onView}
          iconName="Eye"
          iconPosition="left"
          className="flex-1"
        >
          View Details
        </Button>
        
        {status !== 'pending' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              iconName="Edit"
              iconPosition="left"
            >
              Edit
            </Button>
            
            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDownload}
                iconName="Download"
                iconPosition="left"
              >
                Download
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GeneratedContentCard;