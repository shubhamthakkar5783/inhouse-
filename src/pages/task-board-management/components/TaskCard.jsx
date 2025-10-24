import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange,
  isDragging = false,
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error text-error-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'text-success';
      case 'in-progress':
        return 'text-primary';
      case 'review':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date?.getFullYear() !== new Date()?.getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && task?.status !== 'done';
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`bg-card border border-border rounded-lg p-4 shadow-card hover:shadow-modal transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-2' : ''
      } ${className}`}
      onClick={toggleExpanded}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">
            {task?.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task?.description}
          </p>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task?.priority)}`}>
            {task?.priority}
          </span>
        </div>
      </div>
      {/* Assignee and Due Date */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-primary-foreground">
              {task?.assignee?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-muted-foreground truncate">
            {task?.assignee}
          </span>
        </div>

        {task?.dueDate && (
          <div className={`flex items-center space-x-1 ${
            isOverdue(task?.dueDate) ? 'text-error' : 'text-muted-foreground'
          }`}>
            <Icon name="Calendar" size={12} />
            <span className="text-xs">
              {formatDate(task?.dueDate)}
            </span>
          </div>
        )}
      </div>
      {/* Tags */}
      {task?.tags && task?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task?.tags?.slice(0, 3)?.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {task?.tags?.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{task?.tags?.length - 3} more
            </span>
          )}
        </div>
      )}
      {/* Progress Bar */}
      {task?.progress !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-medium text-foreground">{task?.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${task?.progress}%` }}
            />
          </div>
        </div>
      )}
      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border pt-3 mt-3 space-y-3">
          {/* Full Description */}
          {task?.fullDescription && (
            <div>
              <h4 className="text-xs font-medium text-foreground mb-1">Description</h4>
              <p className="text-xs text-muted-foreground">
                {task?.fullDescription}
              </p>
            </div>
          )}

          {/* Subtasks */}
          {task?.subtasks && task?.subtasks?.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-foreground mb-2">Subtasks</h4>
              <div className="space-y-1">
                {task?.subtasks?.map((subtask, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Icon 
                      name={subtask?.completed ? "CheckCircle2" : "Circle"} 
                      size={12} 
                      className={subtask?.completed ? "text-success" : "text-muted-foreground"} 
                    />
                    <span className={`text-xs ${
                      subtask?.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}>
                      {subtask?.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          {task?.comments && task?.comments?.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-foreground mb-2">Recent Comments</h4>
              <div className="space-y-2">
                {task?.comments?.slice(0, 2)?.map((comment, index) => (
                  <div key={index} className="bg-muted rounded-lg p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground">
                        {comment?.author}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment?.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {comment?.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e?.stopPropagation();
                  onEdit && onEdit(task);
                }}
                iconName="Edit2"
                className="text-xs px-2 py-1 h-auto"
              >
                Edit
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e?.stopPropagation();
                  onDelete && onDelete(task?.id);
                }}
                iconName="Trash2"
                className="text-xs px-2 py-1 h-auto text-error hover:text-error"
              >
                Delete
              </Button>
            </div>

            <div className="flex items-center space-x-1">
              <Icon name="MessageCircle" size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {task?.comments ? task?.comments?.length : 0}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Drag Handle */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Icon name="GripVertical" size={12} className="text-muted-foreground" />
      </div>
    </div>
  );
};

export default TaskCard;