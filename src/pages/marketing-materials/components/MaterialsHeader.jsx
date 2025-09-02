import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MaterialsHeader = ({ onQuickAction }) => {
  const handleQuickGenerate = () => {
    if (onQuickAction) {
      onQuickAction('quick-generate');
    }
  };

  const handleExportAll = () => {
    if (onQuickAction) {
      onQuickAction('export-all');
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Megaphone" size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Marketing Materials</h1>
              <p className="text-muted-foreground">AI-generated promotional content and visual assets</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleQuickGenerate}
            iconName="Sparkles"
            iconPosition="left"
          >
            Quick Generate
          </Button>
          <Button
            onClick={handleExportAll}
            iconName="Download"
            iconPosition="left"
          >
            Export All Materials
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">3</div>
          <div className="text-sm text-muted-foreground">Email Templates</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary mb-1">12</div>
          <div className="text-sm text-muted-foreground">Social Captions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent mb-1">8</div>
          <div className="text-sm text-muted-foreground">Visual Assets</div>
        </div>
      </div>
    </div>
  );
};

export default MaterialsHeader;