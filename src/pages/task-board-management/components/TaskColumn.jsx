import React from 'react';
import Icon from '../../../components/AppIcon';
import TaskCard from './TaskCard';

const TaskColumn = ({ 
  column, 
  tasks, 
  onTaskEdit, 
  onTaskDelete, 
  onTaskStatusChange,
  onDrop,
  onDragOver,
  isDragOver = false,
  className = '' 
}) => {
  const getColumnIcon = (status) => {
    switch (status) {
      case 'backlog':
        return 'Archive';
      case 'todo':
        return 'Circle';
      case 'in-progress':
        return 'Play';
      case 'review':
        return 'Eye';
      case 'done':
        return 'CheckCircle2';
      default:
        return 'Circle';
    }
  };

  const getColumnColor = (status) => {
    switch (status) {
      case 'backlog':
        return 'text-muted-foreground';
      case 'todo':
        return 'text-primary';
      case 'in-progress':
        return 'text-warning';
      case 'review':
        return 'text-secondary';
      case 'done':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getColumnBorderColor = (status) => {
    switch (status) {
      case 'backlog':
        return 'border-muted-foreground/20';
      case 'todo':
        return 'border-primary/20';
      case 'in-progress':
        return 'border-warning/20';
      case 'review':
        return 'border-secondary/20';
      case 'done':
        return 'border-success/20';
      default:
        return 'border-border';
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    onDragOver && onDragOver(column?.id);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    const taskId = e?.dataTransfer?.getData('text/plain');
    onDrop && onDrop(taskId, column?.id);
  };

  return (
    <div 
      className={`flex flex-col h-full min-w-80 ${className}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className={`flex items-center justify-between p-4 border-b-2 ${getColumnBorderColor(column?.id)} ${
        isDragOver ? 'bg-muted/50' : 'bg-card'
      } transition-colors duration-200`}>
        <div className="flex items-center space-x-3">
          <Icon 
            name={getColumnIcon(column?.id)} 
            size={18} 
            className={getColumnColor(column?.id)} 
          />
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {column?.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {tasks?.length} {tasks?.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>
        </div>

        {/* Column Actions */}
        <div className="flex items-center space-x-1">
          {column?.id !== 'done' && (
            <div className={`w-2 h-2 rounded-full ${
              tasks?.length > 0 ? getColumnColor(column?.id)?.replace('text-', 'bg-') : 'bg-muted'
            }`} />
          )}
          
          {column?.id === 'done' && tasks?.length > 0 && (
            <Icon name="CheckCircle2" size={14} className="text-success" />
          )}
        </div>
      </div>
      {/* Tasks Container */}
      <div className={`flex-1 p-4 space-y-3 overflow-y-auto min-h-96 ${
        isDragOver ? 'bg-muted/20 border-2 border-dashed border-primary' : 'bg-muted/5'
      } transition-all duration-200`}>
        {tasks?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Icon 
              name={getColumnIcon(column?.id)} 
              size={32} 
              className="text-muted-foreground/50 mb-2" 
            />
            <p className="text-sm text-muted-foreground">
              {column?.id === 'backlog' && 'No tasks in backlog'}
              {column?.id === 'todo' && 'No tasks to do'}
              {column?.id === 'in-progress' && 'No tasks in progress'}
              {column?.id === 'review' && 'No tasks in review'}
              {column?.id === 'done' && 'No completed tasks'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Drag tasks here or create new ones
            </p>
          </div>
        ) : (
          tasks?.map((task) => (
            <div
              key={task?.id}
              draggable
              onDragStart={(e) => {
                if (e.dataTransfer) {
                  e.dataTransfer.setData('text/plain', task?.id);
                  e.dataTransfer.effectAllowed = 'move';
                  e.currentTarget.style.opacity = '0.5';
                }
              }}
              onDragEnd={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              className="group"
            >
              <TaskCard
                task={task}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
                onStatusChange={onTaskStatusChange}
              />
            </div>
          ))
        )}
      </div>
      {/* Column Footer */}
      <div className="p-3 border-t border-border bg-card">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {column?.id === 'done' 
              ? `${tasks?.length} completed` 
              : `${tasks?.filter(t => t?.priority === 'high')?.length} high priority`
            }
          </span>
          {tasks?.length > 0 && (
            <span>
              {Math.round((tasks?.filter(t => t?.progress === 100)?.length / tasks?.length) * 100)}% done
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskColumn;