import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressTracker = ({ progressData, className = '' }) => {
  const phases = [
    { id: 'planning', label: 'Planning', icon: 'Lightbulb' },
    { id: 'preparation', label: 'Preparation', icon: 'Settings' },
    { id: 'execution', label: 'Execution', icon: 'Play' },
    { id: 'followup', label: 'Follow-up', icon: 'CheckCircle2' }
  ];

  const getPhaseStatus = (phaseId) => {
    const phase = progressData?.phases?.find(p => p?.id === phaseId);
    return phase?.status || 'pending';
  };

  const getPhaseProgress = (phaseId) => {
    const phase = progressData?.phases?.find(p => p?.id === phaseId);
    return phase?.progress || 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'in-progress': return 'text-primary';
      case 'pending': return 'text-muted-foreground';
      case 'blocked': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed': return 'bg-success';
      case 'in-progress': return 'bg-primary';
      case 'pending': return 'bg-muted-foreground';
      case 'blocked': return 'bg-error';
      default: return 'bg-muted-foreground';
    }
  };

  const overallProgress = progressData?.phases?.reduce((acc, phase) => acc + phase?.progress, 0) / (progressData?.phases?.length || 1);

  return (
    <div className={`bg-card rounded-lg border border-border p-6 shadow-card ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <span>Progress Tracker</span>
        </h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{Math.round(overallProgress)}%</div>
          <div className="text-xs text-muted-foreground">Overall Progress</div>
        </div>
      </div>
      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Event Completion</span>
          <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
      {/* Phase Progress */}
      <div className="space-y-4">
        {phases?.map((phase, index) => {
          const status = getPhaseStatus(phase?.id);
          const progress = getPhaseProgress(phase?.id);
          const isActive = status === 'in-progress';
          const isCompleted = status === 'completed';

          return (
            <div key={phase?.id} className="relative">
              {/* Connection Line */}
              {index < phases?.length - 1 && (
                <div className="absolute left-4 top-8 w-0.5 h-8 bg-border" />
              )}
              <div className="flex items-start space-x-4">
                {/* Phase Icon */}
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  isCompleted ? 'border-success bg-success' : isActive ?'border-primary bg-primary': 'border-muted-foreground bg-card'
                }`}>
                  <Icon 
                    name={isCompleted ? 'Check' : phase?.icon} 
                    size={16} 
                    className={isCompleted || isActive ? 'text-white' : 'text-muted-foreground'}
                  />
                </div>

                {/* Phase Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground">{phase?.label}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                        status === 'completed' ? 'bg-success/10 text-success' :
                        status === 'in-progress' ? 'bg-primary/10 text-primary' :
                        status === 'blocked'? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'
                      }`}>
                        {status?.replace('-', ' ')}
                      </span>
                      <span className="text-sm text-muted-foreground">{progress}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ease-out ${getStatusBg(status)}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Phase Details */}
                  {progressData?.phases?.find(p => p?.id === phase?.id)?.tasks && (
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground">
                        {progressData?.phases?.find(p => p?.id === phase?.id)?.completedTasks} of{' '}
                        {progressData?.phases?.find(p => p?.id === phase?.id)?.totalTasks} tasks completed
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Key Metrics */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {progressData?.completedTasks || 0}
            </div>
            <div className="text-xs text-muted-foreground">Tasks Done</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {progressData?.daysRemaining || 0}
            </div>
            <div className="text-xs text-muted-foreground">Days Left</div>
          </div>
        </div>
      </div>
      {/* Next Actions */}
      {progressData?.nextActions && progressData?.nextActions?.length > 0 && (
        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-1">
            <Icon name="ArrowRight" size={14} className="text-primary" />
            <span>Next Actions</span>
          </h4>
          <div className="space-y-1">
            {progressData?.nextActions?.slice(0, 3)?.map((action, index) => (
              <div key={index} className="text-xs text-muted-foreground flex items-center space-x-2">
                <Icon name="Dot" size={12} className="text-primary" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;