import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlanActions = ({ onExport, onRegenerate, onCreateTasks, className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      await onExport(format);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerate();
    } finally {
      setIsRegenerating(false);
    }
  };

  const exportOptions = [
    { value: 'pdf', label: 'PDF Document', icon: 'FileText' },
    { value: 'excel', label: 'Excel Spreadsheet', icon: 'FileSpreadsheet' },
    { value: 'word', label: 'Word Document', icon: 'FileText' },
    { value: 'json', label: 'JSON Data', icon: 'Code' }
  ];

  return (
    <div className={`bg-card rounded-lg border border-border p-6 shadow-card ${className}`}>
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
        <Icon name="Zap" size={20} className="text-primary" />
        <span>Plan Actions</span>
      </h2>
      <div className="space-y-4">
        {/* Export Section */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Download" size={16} className="text-accent" />
            <span>Export Plan</span>
          </h3>
          
          <div className="grid grid-cols-1 gap-2 mb-3">
            {exportOptions?.map((option) => (
              <Button
                key={option?.value}
                variant="outline"
                size="sm"
                onClick={() => handleExport(option?.value)}
                loading={isExporting && exportFormat === option?.value}
                disabled={isExporting}
                iconName={option?.icon}
                iconPosition="left"
                className="justify-start"
              >
                {option?.label}
              </Button>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground">
            Export your event plan for sharing with stakeholders or offline reference.
          </p>
        </div>

        {/* Regenerate Section */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="RefreshCw" size={16} className="text-secondary" />
            <span>AI Regeneration</span>
          </h3>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRegenerate}
            loading={isRegenerating}
            iconName="Sparkles"
            iconPosition="left"
            fullWidth
          >
            Generate Alternative Plan
          </Button>
          
          <p className="text-xs text-muted-foreground mt-2">
            Create a new version of your event plan with different timing or activities.
          </p>
        </div>

        {/* Integration Section */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Link" size={16} className="text-primary" />
            <span>Quick Actions</span>
          </h3>
          
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateTasks}
              iconName="CheckSquare"
              iconPosition="left"
              fullWidth
            >
              Create Task Board
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/budget-calculator'}
              iconName="Calculator"
              iconPosition="left"
              fullWidth
            >
              Calculate Budget
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/marketing-materials'}
              iconName="Megaphone"
              iconPosition="left"
              fullWidth
            >
              Generate Marketing
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            Seamlessly transition to other planning tools with your event context.
          </p>
        </div>

        {/* Share Section */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Share2" size={16} className="text-success" />
            <span>Share Plan</span>
          </h3>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Copy"
              iconPosition="left"
              onClick={() => navigator.clipboard?.writeText(window.location?.href)}
            >
              Copy Link
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Mail"
              iconPosition="left"
              onClick={() => window.open(`mailto:?subject=Event Plan&body=Check out this event plan: ${window.location?.href}`)}
            >
              Email
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            Share your event plan with team members and stakeholders.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanActions;