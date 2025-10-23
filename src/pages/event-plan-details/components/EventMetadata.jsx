import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EventMetadata = ({ eventData, onUpdate, className = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(eventData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(eventData);
  };

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(eventData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 shadow-card ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Info" size={20} className="text-primary" />
          <span>Event Details</span>
        </h2>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            iconName="Edit2"
            iconPosition="left"
          >
            Edit
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              iconName="Check"
              iconPosition="left"
            >
              Save
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {/* Event Name */}
        <div>
          {isEditing ? (
            <Input
              label="Event Name"
              type="text"
              value={editData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              className="mb-2"
            />
          ) : (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Event Name</label>
              <p className="text-foreground font-medium">{eventData?.name}</p>
            </div>
          )}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {isEditing ? (
              <Input
                label="Date"
                type="date"
                value={editData?.date}
                onChange={(e) => handleInputChange('date', e?.target?.value)}
              />
            ) : (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <p className="text-foreground flex items-center space-x-2">
                  <Icon name="Calendar" size={16} className="text-primary" />
                  <span>{new Date(eventData.date)?.toLocaleDateString()}</span>
                </p>
              </div>
            )}
          </div>
          <div>
            {isEditing ? (
              <Input
                label="Time"
                type="time"
                value={editData?.time}
                onChange={(e) => handleInputChange('time', e?.target?.value)}
              />
            ) : (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Time</label>
                <p className="text-foreground flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-primary" />
                  <span>{eventData?.time}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          {isEditing ? (
            <Input
              label="Location"
              type="text"
              value={editData?.location}
              onChange={(e) => handleInputChange('location', e?.target?.value)}
            />
          ) : (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              <p className="text-foreground flex items-center space-x-2">
                <Icon name="MapPin" size={16} className="text-primary" />
                <span>{eventData?.location}</span>
              </p>
            </div>
          )}
        </div>

        {/* Attendees */}
        <div>
          {isEditing ? (
            <Input
              label="Expected Attendees"
              type="number"
              value={editData?.attendees}
              onChange={(e) => handleInputChange('attendees', e?.target?.value)}
            />
          ) : (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Expected Attendees</label>
              <p className="text-foreground flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-primary" />
                <span>{eventData?.attendees} people</span>
              </p>
            </div>
          )}
        </div>

        {/* Budget */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">Estimated Budget</label>
          <p className="text-foreground flex items-center space-x-2">
            <Icon name="IndianRupee" size={16} className="text-success" />
            <span className="font-semibold">₹{eventData?.budget?.toLocaleString() || '0'}</span>
          </p>
        </div>

        {/* Key Contacts */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Key Contacts</label>
          <div className="space-y-2">
            {eventData?.contacts?.map((contact, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-muted rounded-md">
                <Icon name="User" size={16} className="text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{contact?.name}</p>
                  <p className="text-xs text-muted-foreground">{contact?.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{contact?.phone}</p>
                  <p className="text-xs text-muted-foreground">{contact?.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">Status</label>
          <div className="flex items-center space-x-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${
              eventData?.status === 'planning' ? 'bg-warning' :
              eventData?.status === 'confirmed' ? 'bg-success' :
              eventData?.status === 'cancelled' ? 'bg-error' : 'bg-muted-foreground'
            }`} />
            <span className="text-sm text-foreground capitalize">{eventData?.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventMetadata;