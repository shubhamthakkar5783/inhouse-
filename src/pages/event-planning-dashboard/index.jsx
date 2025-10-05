import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import QuickActionButton from '../../components/ui/QuickActionButton';
import NotificationToast, { useNotifications } from '../../components/ui/NotificationToast';
import EventPromptForm from './components/EventPromptForm';
import GeneratedContentCard from './components/GeneratedContentCard';
import ProgressOverview from './components/ProgressOverview';
import QuickAccessPanel from './components/QuickAccessPanel';
import EmptyState from './components/EmptyState';
import { eventService } from '../../services/eventService';

const EventPlanningDashboard = () => {
  const navigate = useNavigate();
  const { notifications, showSuccess, showError, showLoading, dismissNotification } = useNotifications();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [generatedContent, setGeneratedContent] = useState([]);

  // Mock generated content data
  const mockGeneratedContent = [
    {
      id: 'event-plan',
      title: 'Event Timeline',
      description: 'Detailed schedule and agenda',
      icon: 'Calendar',
      status: 'completed',
      progress: 100,
      lastUpdated: new Date(Date.now() - 1800000)?.toISOString(),
      items: [
        'Registration & Welcome (9:00 AM)',
        'Opening Keynote (10:00 AM)',
        'Networking Break (11:30 AM)',
        'Panel Discussion (12:00 PM)',
        'Lunch & Networking (1:00 PM)'
      ]
    },
    {
      id: 'task-list',
      title: 'Task Management',
      description: 'Organized action items',
      icon: 'CheckSquare',
      status: 'in-progress',
      progress: 75,
      lastUpdated: new Date(Date.now() - 3600000)?.toISOString(),
      items: [
        'Book venue and confirm availability',
        'Send invitations to speakers',
        'Order catering for 200 attendees',
        'Set up registration system',
        'Prepare welcome materials'
      ]
    },
    {
      id: 'budget',
      title: 'Budget Estimate',
      description: 'Cost breakdown and planning',
      icon: 'DollarSign',
      status: 'completed',
      progress: 100,
      lastUpdated: new Date(Date.now() - 7200000)?.toISOString(),
      items: [
        'Venue: ₹4,15,000',
        'Catering: ₹6,64,000',
        'Speakers: ₹2,49,000',
        'Marketing: ₹1,24,500',
        'Total: ₹14,52,500'
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing Materials',
      description: 'Promotional content and assets',
      icon: 'Megaphone',
      status: 'in-progress',
      progress: 60,
      lastUpdated: new Date(Date.now() - 10800000)?.toISOString(),
      items: [
        'Event poster design',
        'Email invitation template',
        'Social media captions',
        'LinkedIn event page',
        'Registration landing page'
      ]
    }
  ];

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const events = await eventService.getAllEvents();
        if (isMounted && events && events.length > 0) {
          const latestEvent = events[0];
          setEventData(latestEvent);
          setHasGeneratedContent(true);
          setGeneratedContent(mockGeneratedContent);
        }
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGenerateEvent = async (formData) => {
    setIsGenerating(true);
    const loadingId = showLoading('Generating your event plan with AI...');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const savedEvent = await eventService.createEvent({
        eventName: formData.eventName || formData.eventType || 'New Event',
        eventType: formData.eventType,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        city: formData.city,
        venueType: formData.venueType,
        audienceSize: formData.audienceSize,
        duration: formData.duration
      });

      setEventData(savedEvent);
      setGeneratedContent(mockGeneratedContent);
      setHasGeneratedContent(true);

      dismissNotification(loadingId);
      showSuccess('Event plan generated and saved successfully!');

    } catch (error) {
      console.error('Error creating event:', error);
      dismissNotification(loadingId);
      showError('Failed to generate event plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContentAction = (action, contentId) => {
    switch (action) {
      case 'view':
        if (contentId === 'task-list') {
          navigate('/task-board-management');
        } else if (contentId === 'budget') {
          navigate('/budget-calculator');
        } else if (contentId === 'marketing') {
          navigate('/marketing-materials');
        } else if (contentId === 'event-plan') {
          navigate('/event-plan-details');
        }
        break;
      case 'edit':
        showSuccess(`Editing ${contentId} - Feature coming soon!`);
        break;
      case 'download':
        showSuccess(`Downloading ${contentId} materials...`);
        break;
      default:
        break;
    }
  };

  const handleQuickAction = (actionType) => {
    switch (actionType) {
      case 'ai-generate':
        document.querySelector('textarea')?.focus();
        showSuccess('Ready to generate! Describe your event above.');
        break;
      case 'quick-add': navigate('/task-board-management');
        break;
      default:
        showSuccess(`${actionType} action triggered!`);
        break;
    }
  };

  const scrollToForm = () => {
    document.querySelector('textarea')?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!hasGeneratedContent) return 0;
    const totalProgress = generatedContent?.reduce((sum, item) => sum + item?.progress, 0);
    return Math.round(totalProgress / generatedContent?.length);
  };

  const overallProgress = calculateOverallProgress();
  const completedTasks = 9; // Mock data
  const totalTasks = 12; // Mock data

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Event Planning Dashboard
                </h1>
                <p className="text-muted-foreground">
                  {hasGeneratedContent 
                    ? `Managing: ${eventData?.eventType || 'Your Event'}` 
                    : 'Transform your event vision into a comprehensive plan with AI assistance'
                  }
                </p>
              </div>
              
              {hasGeneratedContent && (
                <div className="hidden lg:block">
                  <ProgressIndicator
                    currentStep={Math.floor(overallProgress / 25)}
                    totalSteps={4}
                    completedTasks={completedTasks}
                    totalTasks={totalTasks}
                    budgetCompleted={generatedContent?.find(c => c?.id === 'budget')?.status === 'completed'}
                    marketingCompleted={generatedContent?.find(c => c?.id === 'marketing')?.status === 'completed'}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* Event Prompt Form */}
              <EventPromptForm 
                onGenerate={handleGenerateEvent}
                isGenerating={isGenerating}
              />

              {/* Generated Content or Empty State */}
              {hasGeneratedContent ? (
                <>
                  {/* Progress Overview - Mobile */}
                  <div className="lg:hidden">
                    <ProgressOverview
                      overallProgress={overallProgress}
                      planningComplete={generatedContent?.find(c => c?.id === 'event-plan')?.status === 'completed'}
                      tasksComplete={completedTasks}
                      totalTasks={totalTasks}
                      budgetComplete={generatedContent?.find(c => c?.id === 'budget')?.status === 'completed'}
                      marketingComplete={generatedContent?.find(c => c?.id === 'marketing')?.status === 'completed'}
                    />
                  </div>

                  {/* Generated Content Cards */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-foreground">Generated Content</h2>
                      <div className="text-sm text-muted-foreground">
                        Last updated: {new Date()?.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {generatedContent?.map((content) => (
                        <GeneratedContentCard
                          key={content?.id}
                          title={content?.title}
                          description={content?.description}
                          icon={content?.icon}
                          status={content?.status}
                          progress={content?.progress}
                          lastUpdated={content?.lastUpdated}
                          items={content?.items}
                          onView={() => handleContentAction('view', content?.id)}
                          onEdit={() => handleContentAction('edit', content?.id)}
                          onDownload={content?.id === 'marketing' ? () => handleContentAction('download', content?.id) : null}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <EmptyState onGetStarted={scrollToForm} />
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Progress Overview - Desktop */}
                {hasGeneratedContent && (
                  <div className="hidden lg:block">
                    <ProgressOverview
                      overallProgress={overallProgress}
                      planningComplete={generatedContent?.find(c => c?.id === 'event-plan')?.status === 'completed'}
                      tasksComplete={completedTasks}
                      totalTasks={totalTasks}
                      budgetComplete={generatedContent?.find(c => c?.id === 'budget')?.status === 'completed'}
                      marketingComplete={generatedContent?.find(c => c?.id === 'marketing')?.status === 'completed'}
                    />
                  </div>
                )}

                {/* Quick Access Panel */}
                <QuickAccessPanel />
              </div>
            </div>
          </div>
        </div>
      </main>
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

export default EventPlanningDashboard;