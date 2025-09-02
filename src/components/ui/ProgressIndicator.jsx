import React from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  currentStep = 0, 
  totalSteps = 5, 
  completedTasks = 0, 
  totalTasks = 0,
  budgetCompleted = false,
  marketingCompleted = false,
  className = '' 
}) => {
  const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 50) return 'bg-primary';
    if (percentage >= 25) return 'bg-warning';
    return 'bg-muted-foreground';
  };

  const getProgressTextColor = (percentage) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 50) return 'text-primary';
    if (percentage >= 25) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-4 shadow-card ${className}`}>
      {/* Overall Progress */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="Target" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Event Progress</span>
        </div>
        <span className={`text-sm font-semibold ${getProgressTextColor(progressPercentage)}`}>
          {Math.round(progressPercentage)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all duration-300 ease-out ${getProgressColor(progressPercentage)}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Detailed Progress Items */}
      <div className="space-y-2">
        {/* Tasks Progress */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Icon 
              name={taskProgress === 100 ? "CheckCircle2" : "Circle"} 
              size={12} 
              className={taskProgress === 100 ? "text-success" : "text-muted-foreground"} 
            />
            <span className="text-muted-foreground">Tasks</span>
          </div>
          <span className={`font-medium ${getProgressTextColor(taskProgress)}`}>
            {completedTasks}/{totalTasks}
          </span>
        </div>

        {/* Budget Progress */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Icon 
              name={budgetCompleted ? "CheckCircle2" : "Circle"} 
              size={12} 
              className={budgetCompleted ? "text-success" : "text-muted-foreground"} 
            />
            <span className="text-muted-foreground">Budget</span>
          </div>
          <span className={`font-medium ${budgetCompleted ? "text-success" : "text-muted-foreground"}`}>
            {budgetCompleted ? "Complete" : "In Progress"}
          </span>
        </div>

        {/* Marketing Progress */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Icon 
              name={marketingCompleted ? "CheckCircle2" : "Circle"} 
              size={12} 
              className={marketingCompleted ? "text-success" : "text-muted-foreground"} 
            />
            <span className="text-muted-foreground">Marketing</span>
          </div>
          <span className={`font-medium ${marketingCompleted ? "text-success" : "text-muted-foreground"}`}>
            {marketingCompleted ? "Complete" : "In Progress"}
          </span>
        </div>
      </div>

      {/* Completion Message */}
      {progressPercentage === 100 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-2 text-success">
            <Icon name="PartyPopper" size={14} />
            <span className="text-xs font-medium">Event planning complete!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;