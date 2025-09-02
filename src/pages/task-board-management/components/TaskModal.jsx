import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const TaskModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  task = null,
  mode = 'create' // 'create' or 'edit'
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    assignee: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    category: '',
    tags: [],
    progress: 0,
    subtasks: []
  });

  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData({
        ...task,
        dueDate: task?.dueDate ? new Date(task.dueDate)?.toISOString()?.split('T')?.[0] : '',
        tags: task?.tags || [],
        subtasks: task?.subtasks || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        fullDescription: '',
        assignee: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
        category: '',
        tags: [],
        progress: 0,
        subtasks: []
      });
    }
    setErrors({});
  }, [task, mode, isOpen]);

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  const statusOptions = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'done', label: 'Done' }
  ];

  const assigneeOptions = [
    { value: 'Sarah Johnson', label: 'Sarah Johnson' },
    { value: 'Mike Chen', label: 'Mike Chen' },
    { value: 'Emily Davis', label: 'Emily Davis' },
    { value: 'Alex Rodriguez', label: 'Alex Rodriguez' },
    { value: 'Lisa Wang', label: 'Lisa Wang' }
  ];

  const categoryOptions = [
    { value: 'venue', label: 'Venue & Location' },
    { value: 'catering', label: 'Catering & Food' },
    { value: 'marketing', label: 'Marketing & Promotion' },
    { value: 'logistics', label: 'Logistics & Setup' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'documentation', label: 'Documentation' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addTag = () => {
    if (newTag?.trim() && !formData?.tags?.includes(newTag?.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev?.tags, newTag?.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev?.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const addSubtask = () => {
    if (newSubtask?.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev?.subtasks, {
          id: Date.now(),
          title: newSubtask?.trim(),
          completed: false
        }]
      }));
      setNewSubtask('');
    }
  };

  const removeSubtask = (subtaskId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev?.subtasks?.filter(st => st?.id !== subtaskId)
    }));
  };

  const toggleSubtask = (subtaskId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev?.subtasks?.map(st => 
        st?.id === subtaskId ? { ...st, completed: !st?.completed } : st
      )
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.title?.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (!formData?.description?.trim()) {
      newErrors.description = 'Task description is required';
    }
    
    if (!formData?.assignee) {
      newErrors.assignee = 'Please assign this task to someone';
    }
    
    if (!formData?.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const taskData = {
      ...formData,
      id: task?.id || Date.now(),
      dueDate: formData?.dueDate ? new Date(formData.dueDate)?.toISOString() : null,
      createdAt: task?.createdAt || new Date()?.toISOString(),
      updatedAt: new Date()?.toISOString()
    };

    onSave(taskData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1200 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-card rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Plus" size={20} className="text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {mode === 'edit' ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'edit' ? 'Update task details' : 'Add a new task to your board'}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-8 h-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
              
              <Input
                label="Task Title"
                type="text"
                placeholder="Enter task title..."
                value={formData?.title}
                onChange={(e) => handleInputChange('title', e?.target?.value)}
                error={errors?.title}
                required
              />
              
              <Input
                label="Short Description"
                type="text"
                placeholder="Brief description of the task..."
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                error={errors?.description}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Detailed description of the task..."
                  value={formData?.fullDescription}
                  onChange={(e) => handleInputChange('fullDescription', e?.target?.value)}
                />
              </div>
            </div>

            {/* Assignment & Priority */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Assignment & Priority</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Assignee"
                  options={assigneeOptions}
                  value={formData?.assignee}
                  onChange={(value) => handleInputChange('assignee', value)}
                  error={errors?.assignee}
                  required
                  searchable
                />
                
                <Select
                  label="Priority"
                  options={priorityOptions}
                  value={formData?.priority}
                  onChange={(value) => handleInputChange('priority', value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Status"
                  options={statusOptions}
                  value={formData?.status}
                  onChange={(value) => handleInputChange('status', value)}
                />
                
                <Select
                  label="Category"
                  options={categoryOptions}
                  value={formData?.category}
                  onChange={(value) => handleInputChange('category', value)}
                  error={errors?.category}
                  required
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Timeline & Progress</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Due Date"
                  type="date"
                  value={formData?.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
                />
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Progress ({formData?.progress}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData?.progress}
                    onChange={(e) => handleInputChange('progress', parseInt(e?.target?.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Tags</h3>
              
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e?.target?.value)}
                  onKeyPress={(e) => e?.key === 'Enter' && addTag()}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                  iconName="Plus"
                >
                  Add
                </Button>
              </div>
              
              {formData?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-error"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Subtasks */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Subtasks</h3>
              
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Add a subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e?.target?.value)}
                  onKeyPress={(e) => e?.key === 'Enter' && addSubtask()}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSubtask}
                  iconName="Plus"
                >
                  Add
                </Button>
              </div>
              
              {formData?.subtasks?.length > 0 && (
                <div className="space-y-2">
                  {formData?.subtasks?.map((subtask) => (
                    <div key={subtask?.id} className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
                      <Checkbox
                        checked={subtask?.completed}
                        onChange={(e) => toggleSubtask(subtask?.id)}
                      />
                      <span className={`flex-1 text-sm ${
                        subtask?.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                      }`}>
                        {subtask?.title}
                      </span>
                      <button
                        onClick={() => removeSubtask(subtask?.id)}
                        className="text-muted-foreground hover:text-error"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/20">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            iconName="Save"
          >
            {mode === 'edit' ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;