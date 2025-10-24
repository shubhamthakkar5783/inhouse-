import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
import NotificationToast, { useNotifications } from '../../components/ui/NotificationToast';
import EventMetadata from './components/EventMetadata';
import EventTimeline from './components/EventTimeline';
import PlanActions from './components/PlanActions';
import ProgressTracker from './components/ProgressTracker';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { eventService } from '../../services/eventService';
import { supabase } from '../../lib/supabaseClient';

const EventPlanDetails = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline');
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const { notifications, showSuccess, showError, showInfo, dismissNotification } = useNotifications();

  const getVenueName = (venueCode) => {
    const venueMapping = {
      'taj-palace-lawns': 'Taj Palace Lawns - Luxury Garden',
      'leela-ambience': 'The Leela Ambience - Grand Ballroom',
      'itc-maurya': 'ITC Maurya - Conference & Banquet Hall',
      'oberoi-sky-terrace': 'The Oberoi Sky Terrace - Premium Rooftop',
      'trident-poolside': 'Trident Poolside Lawns - Lakeside View',
      'lalit-ashok': 'The Lalit Ashok - Convention Center'
    };
    return venueMapping[venueCode] || venueCode;
  };

  useEffect(() => {
    const loadEventData = async () => {
      setIsLoading(true);

      try {
        const events = await eventService.getAllEvents();

        if (!events || events.length === 0) {
          showError('No events found. Please create an event first.');
          setTimeout(() => navigate('/event-planning-dashboard'), 2000);
          return;
        }

        const latestEvent = events[0];

        const { data: aiContent, error: aiError } = await supabase
          .from('ai_generated_content')
          .select('*')
          .eq('event_id', latestEvent.id)
          .eq('content_type', 'event_plan')
          .order('created_at', { ascending: false })
          .maybeSingle();

        if (aiError) {
          console.error('Error fetching AI content:', aiError);
        }

        const generatedContent = aiContent?.generated_content;
        setGeneratedPlan(generatedContent);

        const mockEventData = {
          id: latestEvent.id,
          name: latestEvent.eventName || latestEvent.eventType || 'Event',
          date: latestEvent.date || '2025-03-15',
          time: latestEvent.time || '09:00',
          location: latestEvent.location ? getVenueName(latestEvent.location) : (latestEvent.venueType || 'TBD'),
          attendees: latestEvent.audienceSize || 50,
          budget: latestEvent.budget || 10000,
          status: 'planning',
          description: latestEvent.description || 'Event description',
          contacts: generatedContent?.contacts || [
            {
              name: 'Event Manager',
              role: 'Event Manager',
              phone: 'TBD',
              email: 'TBD'
            }
          ]
        };

        let mockTimelineData = [];

        if (generatedContent?.timeline && Array.isArray(generatedContent.timeline)) {
          mockTimelineData = generatedContent.timeline.map((item, index) => ({
            id: `tl_${index + 1}`,
            title: item.activity || item.title || 'Activity',
            type: item.type || 'general',
            startTime: item.time || `${9 + index}:00`,
            duration: item.duration || 60,
            location: item.location || mockEventData.location,
            attendees: item.attendees || mockEventData.attendees,
            description: item.description || item.details || '',
            resources: item.resources || [],
            assignedTo: item.assignedTo || item.assigned_to || [],
            notes: item.notes || ''
          }));
        } else {
          mockTimelineData = [
            {
              id: 'tl_001',
              title: 'Event Setup',
              type: 'setup',
              startTime: mockEventData.time || '09:00',
              duration: 60,
              location: mockEventData.location,
              attendees: mockEventData.attendees,
              description: 'Initial setup and preparation',
              resources: [],
              assignedTo: [],
              notes: 'Generated event plan - timeline details pending'
            }
          ];
        }

        const mockProgressData = {
          phases: [
            {
              id: 'planning',
              status: 'completed',
              progress: 100,
              completedTasks: 1,
              totalTasks: 1
            },
            {
              id: 'preparation',
              status: 'in-progress',
              progress: 50,
              completedTasks: 0,
              totalTasks: generatedContent?.tasks?.length || 5
            },
            {
              id: 'execution',
              status: 'pending',
              progress: 0,
              completedTasks: 0,
              totalTasks: mockTimelineData.length
            },
            {
              id: 'followup',
              status: 'pending',
              progress: 0,
              completedTasks: 0,
              totalTasks: 3
            }
          ],
          completedTasks: 1,
          totalTasks: (generatedContent?.tasks?.length || 5) + mockTimelineData.length + 3,
          daysRemaining: latestEvent.date ? Math.ceil((new Date(latestEvent.date) - new Date()) / (1000 * 60 * 60 * 24)) : 30,
          nextActions: generatedContent?.tasks?.slice(0, 4)?.map(t => t.task || t.title || t) || [
            'Review event plan details',
            'Confirm venue and arrangements',
            'Prepare materials',
            'Send invitations'
          ]
        };

        setEventData(mockEventData);
        setTimelineData(mockTimelineData);
        setProgressData(mockProgressData);

        showSuccess('Event plan loaded successfully');
      } catch (error) {
        console.error('Error loading event data:', error);
        showError('Failed to load event plan.');

        setEventData({
          id: 'evt_001',
          name: 'Sample Event',
          date: '2025-03-15',
          time: '09:00',
          location: 'TBD',
          attendees: 50,
          budget: 10000,
          status: 'planning',
          contacts: []
        });
        setTimelineData([]);
        setProgressData({
          phases: [],
          completedTasks: 0,
          totalTasks: 0,
          daysRemaining: 30,
          nextActions: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEventData();
  }, [navigate, showError, showSuccess]);

  const handleUpdateEvent = async (updatedData) => {
    try {
      await eventService.updateEvent(eventData.id, {
        eventName: updatedData.name,
        date: updatedData.date,
        time: updatedData.time,
        location: updatedData.location,
        audienceSize: updatedData.attendees,
        budget: updatedData.budget,
        description: updatedData.description
      });

      setEventData(updatedData);
      showSuccess('Event details updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      showError('Failed to update event details');
    }
  };

  const handleUpdateActivity = (activityId, updatedActivity) => {
    try {
      setTimelineData(prev =>
        prev?.map(item =>
          item?.id === activityId ? { ...item, ...updatedActivity, updatedAt: new Date()?.toISOString() } : item
        )
      );
      showSuccess('Activity updated successfully');
    } catch (error) {
      console.error('Error updating activity:', error);
      showError('Failed to update activity');
    }
  };

  const handleAddActivity = () => {
    try {
      const newActivity = {
        id: `tl_${Date.now()}`,
        title: 'New Activity',
        type: 'setup',
        startTime: '10:00',
        duration: 60,
        location: 'TBD',
        attendees: 10,
        description: 'New activity description',
        resources: [],
        assignedTo: [],
        notes: '',
        createdAt: new Date()?.toISOString()
      };

      setTimelineData(prev => [...prev, newActivity]);
      showSuccess('New activity added to timeline');
    } catch (error) {
      console.error('Error adding activity:', error);
      showError('Failed to add new activity');
    }
  };

  const handleExport = async (format) => {
    try {
      showInfo(`Exporting plan as ${format?.toUpperCase()}...`);

      const exportData = {
        eventData,
        timelineData,
        progressData,
        generatedPlan,
        exportFormat: format,
        exportedAt: new Date()?.toISOString()
      };

      await new Promise(resolve => setTimeout(resolve, 2000));

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: format === 'json' ? 'application/json' : 'text/plain'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `event-plan-${eventData?.name?.replace(/\s+/g, '-')?.toLowerCase()}.${format}`;
      document.body?.appendChild(a);
      a?.click();
      document.body?.removeChild(a);
      URL.revokeObjectURL(url);

      showSuccess(`Plan exported as ${format?.toUpperCase()} successfully`);
    } catch (error) {
      console.error('Export failed:', error);
      showError(`Failed to export plan as ${format?.toUpperCase()}`);
    }
  };

  const handleRegenerate = async () => {
    try {
      showInfo('Generating alternative plan...');

      await new Promise(resolve => setTimeout(resolve, 3000));

      const regeneratedTimeline = timelineData?.map(item => ({
        ...item,
        duration: item.duration + (Math.random() > 0.5 ? 15 : -15),
        updatedAt: new Date()?.toISOString()
      }));

      setTimelineData(regeneratedTimeline);
      showSuccess('Alternative plan generated successfully');
    } catch (error) {
      console.error('Regeneration failed:', error);
      showError('Failed to generate alternative plan');
    }
  };

  const handleCreateTasks = () => {
    try {
      const taskContext = {
        eventId: eventData?.id,
        eventName: eventData?.name,
        eventDate: eventData?.date,
        timelineActivities: timelineData?.map(item => ({
          id: item.id,
          title: item.title,
          type: item.type,
          assignedTo: item.assignedTo
        }))
      };

      localStorage.setItem('taskCreationContext', JSON.stringify(taskContext));

      showSuccess('Redirecting to task board...');
      setTimeout(() => {
        window.location.href = '/task-board-management';
      }, 1000);
    } catch (error) {
      console.error('Error preparing task creation:', error);
      showError('Failed to prepare task creation');
    }
  };

  const handleQuickAction = (actionType) => {
    switch (actionType) {
      case 'add-event':
        handleAddActivity();
        break;
      case 'set-reminder': showInfo('Reminder set for 1 hour before event');
        break;
      case 'ai-generate':
        handleRegenerate();
        break;
      case 'quick-add':
        handleAddActivity();
        break;
      default:
        showInfo(`${actionType} action triggered`);
    }
  };

  const viewModeOptions = [
    { value: 'timeline', label: 'Timeline', icon: 'Clock' },
    { value: 'gantt', label: 'Gantt Chart', icon: 'BarChart3' },
    { value: 'calendar', label: 'Calendar', icon: 'Calendar' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Icon name="Loader2" size={32} className="text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading event plan...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Event Plan Details</h1>
                <p className="text-muted-foreground">
                  Comprehensive timeline and details for your event planning
                </p>
              </div>

              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                {viewModeOptions?.map((option) => (
                  <Button
                    key={option?.value}
                    variant={viewMode === option?.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode(option?.value)}
                    iconName={option?.icon}
                    iconPosition="left"
                  >
                    {option?.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <EventMetadata
                eventData={eventData}
                onUpdate={handleUpdateEvent}
              />

              <PlanActions
                onExport={handleExport}
                onRegenerate={handleRegenerate}
                onCreateTasks={handleCreateTasks}
              />
            </div>

            <div className="lg:col-span-2">
              {viewMode === 'timeline' && (
                <EventTimeline
                  timelineData={timelineData}
                  eventStartTime={eventData?.time}
                  onUpdateActivity={handleUpdateActivity}
                  onAddActivity={handleAddActivity}
                />
              )}

              {viewMode === 'gantt' && (
                <div className="bg-card rounded-lg border border-border p-8 shadow-card text-center">
                  <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Gantt Chart View</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced project timeline visualization coming soon
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setViewMode('timeline')}
                    iconName="ArrowLeft"
                    iconPosition="left"
                  >
                    Back to Timeline
                  </Button>
                </div>
              )}

              {viewMode === 'calendar' && (
                <div className="bg-card rounded-lg border border-border p-8 shadow-card text-center">
                  <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Calendar View</h3>
                  <p className="text-muted-foreground mb-4">
                    Calendar integration and scheduling view coming soon
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setViewMode('timeline')}
                    iconName="ArrowLeft"
                    iconPosition="left"
                  >
                    Back to Timeline
                  </Button>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <ProgressTracker progressData={progressData} />
            </div>
          </div>

          <div className="lg:hidden mt-8 p-4 bg-card rounded-lg border border-border shadow-card">
            <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/task-board-management'}
                iconName="CheckSquare"
                iconPosition="left"
              >
                Tasks
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/budget-calculator'}
                iconName="Calculator"
                iconPosition="left"
              >
                Budget
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/marketing-materials'}
                iconName="Megaphone"
                iconPosition="left"
              >
                Marketing
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
      <QuickActionButton onAction={handleQuickAction} />
      <NotificationToast
        notifications={notifications}
        onDismiss={dismissNotification}
        position="top-right"
      />
    </div>
  );
};

export default EventPlanDetails;
