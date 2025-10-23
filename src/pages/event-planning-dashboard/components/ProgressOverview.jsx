import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressOverview = ({ 
  overallProgress = 0,
  planningComplete = false,
  tasksComplete = 0,
  totalTasks = 0,
  budgetComplete = false,
  marketingComplete = false,
  className = ''
}) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 50) return 'text-primary';
    if (percentage >= 25) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getProgressBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 50) return 'bg-primary';
    if (percentage >= 25) return 'bg-warning';
    return 'bg-muted-foreground';
  };

  const progressItems = [
    {
      label: 'Event Planning',
      completed: planningComplete,
      icon: 'Calendar',
      description: 'Timeline and agenda'
    },
    {
      label: 'Task Management',
      completed: totalTasks > 0 ? (tasksComplete / totalTasks) * 100 >= 100 : false,
      icon: 'CheckSquare',
      description: `${tasksComplete}/${totalTasks} tasks`
    },
    {
      label: 'Budget Planning',
      completed: budgetComplete,
      icon: 'IndianRupee',
      description: 'Cost estimation'
    },
    {
      label: 'Marketing Materials',
      completed: marketingComplete,
      icon: 'Megaphone',
      description: 'Promotional content'
    }
  ];

  return (
    <div className={`bg-card rounded-lg border border-border p-6 shadow-card ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Target" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Event Progress</h3>
            <p className="text-sm text-muted-foreground">Track your planning milestones</p>
          </div>
        </div>
        <div className={`text-2xl font-bold ${getProgressColor(overallProgress)}`}>
          {Math.round(overallProgress)}%
        </div>
      </div>
      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Overall Completion</span>
          <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}% Complete</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getProgressBgColor(overallProgress)}`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
      {/* Progress Items */}
      <div className="space-y-4">
        {progressItems?.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                item?.completed ? 'bg-success/10' : 'bg-muted'
              }`}>
                <Icon 
                  name={item?.completed ? 'CheckCircle2' : item?.icon} 
                  size={16} 
                  className={item?.completed ? 'text-success' : 'text-muted-foreground'} 
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item?.label}</p>
                <p className="text-xs text-muted-foreground">{item?.description}</p>
              </div>
            </div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              item?.completed 
                ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
            }`}>
              {item?.completed ? 'Complete' : 'Pending'}
            </div>
          </div>
        ))}
      </div>
      {/* Completion Message */}
      {overallProgress === 100 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-success">
            <Icon name="PartyPopper" size={16} />
            <span className="text-sm font-medium">Congratulations! Your event is ready to launch! 🎉</span>
          </div>
        </div>
      )}
      {/* Next Steps */}
      {overallProgress < 100 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-primary">
            <Icon name="ArrowRight" size={14} />
            <span className="text-xs font-medium">
              Next: {progressItems?.find(item => !item?.completed)?.label || 'Review and finalize'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressOverview;