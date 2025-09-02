import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
import NotificationToast, { useNotifications } from '../../components/ui/NotificationToast';
import EventMetadata from './components/EventMetadata';
import EventTimeline from './components/EventTimeline';
import PlanActions from './components/PlanActions';
import ProgressTracker from './components/ProgressTracker';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const EventPlanDetails = () => {
  const [eventData, setEventData] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // timeline, gantt, calendar
  
  const { notifications, showSuccess, showError, showInfo, dismissNotification } = useNotifications();

  // Mock event data
  useEffect(() => {
    const loadEventData = () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockEventData = {
          id: 'evt_001',
          name: 'Annual Tech Conference 2025',
          date: '2025-03-15',
          time: '09:00',
          location: 'Grand Convention Center, San Francisco',
          attendees: 500,
          budget: 75000,
          status: 'planning',
          contacts: [
            {
              name: 'Sarah Johnson',
              role: 'Event Manager',
              phone: '+1 (555) 123-4567',
              email: 'sarah.johnson@techconf.com'
            },
            {
              name: 'Michael Chen',
              role: 'Technical Coordinator',
              phone: '+1 (555) 234-5678',
              email: 'michael.chen@techconf.com'
            },
            {
              name: 'Emily Rodriguez',
              role: 'Marketing Lead',
              phone: '+1 (555) 345-6789',
              email: 'emily.rodriguez@techconf.com'
            }
          ]
        };

        const mockTimelineData = [
          {
            id: 'tl_001',
            title: 'Venue Setup & Registration',
            type: 'setup',
            startTime: '07:00',
            duration: 120,
            location: 'Main Hall',
            attendees: 10,
            description: 'Complete venue setup including registration desks, signage, and technical equipment testing.',
            resources: ['Registration desks', 'Welcome banners', 'Audio/Visual equipment', 'Name badges', 'Welcome packets'],
            assignedTo: ['Setup Team', 'Registration Staff'],
            notes: 'Ensure all technical equipment is tested 30 minutes before event start.'
          },
          {
            id: 'tl_002',
            title: 'Opening Keynote',
            type: 'presentation',
            startTime: '09:00',
            duration: 60,
            location: 'Main Auditorium',
            attendees: 500,
            description: 'Welcome address and opening keynote presentation by industry leader.',
            resources: ['Main stage setup', 'Wireless microphone', 'Presentation screen', 'Lighting system'],
            assignedTo: ['AV Team', 'Stage Manager'],
            notes: 'Speaker needs wireless lapel mic and clicker for slides.'
          },
          {
            id: 'tl_003',
            title: 'Networking Coffee Break',
            type: 'break',
            startTime: '10:00',
            duration: 30,
            location: 'Exhibition Hall',
            attendees: 500,
            description: 'Coffee, tea, and light refreshments with networking opportunities.',
            resources: ['Coffee stations', 'Pastries', 'High-top tables', 'Networking materials'],
            assignedTo: ['Catering Team', 'Event Staff'],
            notes: 'Ensure dietary restrictions are accommodated with alternative options.'
          },
          {
            id: 'tl_004',
            title: 'Technical Workshops',
            type: 'presentation',
            startTime: '10:30',
            duration: 90,
            location: 'Breakout Rooms A, B, C',
            attendees: 150,
            description: 'Parallel technical workshops on AI, Cloud Computing, and Cybersecurity.',
            resources: ['Laptops for hands-on sessions', 'Workshop materials', 'Whiteboards', 'Projectors'],
            assignedTo: ['Workshop Facilitators', 'Technical Support'],
            notes: 'Each room needs dedicated technical support staff.'
          },
          {
            id: 'tl_005',
            title: 'Lunch & Exhibition',
            type: 'meal',
            startTime: '12:00',
            duration: 60,
            location: 'Exhibition Hall',
            attendees: 500,
            description: 'Buffet lunch with sponsor exhibition booths and product demonstrations.',
            resources: ['Buffet stations', 'Exhibition booths', 'Demo equipment', 'Seating areas'],
            assignedTo: ['Catering Team', 'Exhibition Coordinators'],
            notes: 'Coordinate with sponsors for booth setup and demo schedules.'
          },
          {
            id: 'tl_006',
            title: 'Panel Discussion',
            type: 'presentation',
            startTime: '13:00',
            duration: 75,
            location: 'Main Auditorium',
            attendees: 500,
            description: 'Industry expert panel on future technology trends and innovations.',
            resources: ['Panel table setup', 'Multiple microphones', 'Moderator materials'],
            assignedTo: ['Moderator', 'AV Team'],
            notes: 'Prepare backup questions for moderator in case of time gaps.'
          },
          {
            id: 'tl_007',
            title: 'Closing Ceremony & Awards',
            type: 'presentation',
            startTime: '14:15',
            duration: 45,
            location: 'Main Auditorium',
            attendees: 500,
            description: 'Award presentations, closing remarks, and next year announcements.',
            resources: ['Award trophies', 'Presentation materials', 'Photography equipment'],
            assignedTo: ['Event Manager', 'Photography Team'],
            notes: 'Ensure all award recipients are present and prepared.'
          },
          {
            id: 'tl_008',
            title: 'Venue Cleanup',
            type: 'cleanup',
            startTime: '15:00',
            duration: 120,
            location: 'All Areas',
            attendees: 15,
            description: 'Complete venue cleanup, equipment breakdown, and material collection.',
            resources: ['Cleaning supplies', 'Storage containers', 'Transportation'],
            assignedTo: ['Cleanup Crew', 'Equipment Team'],
            notes: 'Coordinate with venue management for final inspection.'
          }
        ];

        const mockProgressData = {
          phases: [
            {
              id: 'planning',
              status: 'completed',
              progress: 100,
              completedTasks: 12,
              totalTasks: 12
            },
            {
              id: 'preparation',
              status: 'in-progress',
              progress: 65,
              completedTasks: 8,
              totalTasks: 15
            },
            {
              id: 'execution',
              status: 'pending',
              progress: 0,
              completedTasks: 0,
              totalTasks: 8
            },
            {
              id: 'followup',
              status: 'pending',
              progress: 0,
              completedTasks: 0,
              totalTasks: 5
            }
          ],
          completedTasks: 20,
          totalTasks: 40,
          daysRemaining: 45,
          nextActions: [
            'Finalize catering menu and dietary options',
            'Confirm speaker travel arrangements',
            'Complete venue layout and seating plan',
            'Send final event details to all attendees'
          ]
        };

        setEventData(mockEventData);
        setTimelineData(mockTimelineData);
        setProgressData(mockProgressData);
        setIsLoading(false);
        
        showInfo('Event plan loaded successfully');
      }, 1000);
    };

    loadEventData();
  }, [showInfo]);

  const handleUpdateEvent = (updatedData) => {
    setEventData(updatedData);
    showSuccess('Event details updated successfully');
  };

  const handleUpdateActivity = (activityId, updatedActivity) => {
    setTimelineData(prev => 
      prev?.map(item => 
        item?.id === activityId ? { ...item, ...updatedActivity } : item
      )
    );
    showSuccess('Activity updated successfully');
  };

  const handleAddActivity = () => {
    showInfo('Add activity feature coming soon');
  };

  const handleExport = async (format) => {
    showInfo(`Exporting plan as ${format?.toUpperCase()}...`);
    // Simulate export process
    setTimeout(() => {
      showSuccess(`Plan exported as ${format?.toUpperCase()} successfully`);
    }, 2000);
  };

  const handleRegenerate = async () => {
    showInfo('Generating alternative plan...');
    // Simulate regeneration process
    setTimeout(() => {
      showSuccess('Alternative plan generated successfully');
    }, 3000);
  };

  const handleCreateTasks = () => {
    showSuccess('Redirecting to task board...');
    setTimeout(() => {
      window.location.href = '/task-board-management';
    }, 1000);
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
          {/* Page Header */}
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

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Event Metadata & Actions */}
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

            {/* Main Content Area - Timeline */}
            <div className="lg:col-span-2">
              {viewMode === 'timeline' && (
                <EventTimeline
                  timelineData={timelineData}
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

            {/* Right Sidebar - Progress Tracker */}
            <div className="lg:col-span-1">
              <ProgressTracker progressData={progressData} />
            </div>
          </div>

          {/* Mobile-Optimized Bottom Actions */}
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
      {/* Quick Action Button */}
      <QuickActionButton onAction={handleQuickAction} />
      {/* Notifications */}
      <NotificationToast
        notifications={notifications}
        onDismiss={dismissNotification}
        position="top-right"
      />
    </div>
  );
};

export default EventPlanDetails;