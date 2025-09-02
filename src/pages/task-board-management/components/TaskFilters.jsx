import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TaskFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  taskStats = {},
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const assigneeOptions = [
    { value: '', label: 'All Assignees' },
    { value: 'Sarah Johnson', label: 'Sarah Johnson' },
    { value: 'Mike Chen', label: 'Mike Chen' },
    { value: 'Emily Davis', label: 'Emily Davis' },
    { value: 'Alex Rodriguez', label: 'Alex Rodriguez' },
    { value: 'Lisa Wang', label: 'Lisa Wang' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'venue', label: 'Venue & Location' },
    { value: 'catering', label: 'Catering & Food' },
    { value: 'marketing', label: 'Marketing & Promotion' },
    { value: 'logistics', label: 'Logistics & Setup' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'documentation', label: 'Documentation' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'done', label: 'Done' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleClearAll = () => {
    onClearFilters();
    setIsExpanded(false);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value && value !== '');

  return (
    <div className={`bg-card border border-border rounded-lg shadow-card ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={18} className="text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Task Filters</h3>
            <p className="text-xs text-muted-foreground">
              {hasActiveFilters ? 'Filters applied' : 'Filter and search tasks'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              iconName="X"
              className="text-xs px-2 py-1 h-auto"
            >
              Clear
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8"
          >
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
            />
          </Button>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="p-4 border-b border-border bg-muted/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {taskStats?.total || 0}
            </div>
            <div className="text-xs text-muted-foreground">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">
              {taskStats?.inProgress || 0}
            </div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-warning">
              {taskStats?.overdue || 0}
            </div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-success">
              {taskStats?.completed || 0}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
      </div>
      {/* Search Bar - Always Visible */}
      <div className="p-4">
        <Input
          type="search"
          placeholder="Search tasks by title, description, or assignee..."
          value={filters?.search || ''}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Priority Filter */}
            <Select
              label="Priority"
              options={priorityOptions}
              value={filters?.priority || ''}
              onChange={(value) => handleFilterChange('priority', value)}
              className="w-full"
            />

            {/* Assignee Filter */}
            <Select
              label="Assignee"
              options={assigneeOptions}
              value={filters?.assignee || ''}
              onChange={(value) => handleFilterChange('assignee', value)}
              searchable
              className="w-full"
            />

            {/* Category Filter */}
            <Select
              label="Category"
              options={categoryOptions}
              value={filters?.category || ''}
              onChange={(value) => handleFilterChange('category', value)}
              className="w-full"
            />

            {/* Status Filter */}
            <Select
              label="Status"
              options={statusOptions}
              value={filters?.status || ''}
              onChange={(value) => handleFilterChange('status', value)}
              className="w-full"
            />
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Due Date From"
              value={filters?.dueDateFrom || ''}
              onChange={(e) => handleFilterChange('dueDateFrom', e?.target?.value)}
            />
            
            <Input
              type="date"
              label="Due Date To"
              value={filters?.dueDateTo || ''}
              onChange={(e) => handleFilterChange('dueDateTo', e?.target?.value)}
            />
          </div>

          {/* Additional Options */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <Button
              variant={filters?.showOverdueOnly ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('showOverdueOnly', !filters?.showOverdueOnly)}
              iconName="AlertTriangle"
              className="text-xs"
            >
              Overdue Only
            </Button>
            
            <Button
              variant={filters?.showHighPriorityOnly ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('showHighPriorityOnly', !filters?.showHighPriorityOnly)}
              iconName="AlertCircle"
              className="text-xs"
            >
              High Priority
            </Button>
            
            <Button
              variant={filters?.showMyTasksOnly ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('showMyTasksOnly', !filters?.showMyTasksOnly)}
              iconName="User"
              className="text-xs"
            >
              My Tasks
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;