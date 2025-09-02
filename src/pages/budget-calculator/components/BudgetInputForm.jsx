import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const BudgetInputForm = ({ 
  formData, 
  onFormChange, 
  onTemplateSelect, 
  onCalculate,
  isCalculating = false 
}) => {
  const [activeSection, setActiveSection] = useState('basic');

  const cityOptions = [
    { value: 'new-york', label: 'New York, NY', description: 'High cost metropolitan area' },
    { value: 'los-angeles', label: 'Los Angeles, CA', description: 'Premium West Coast pricing' },
    { value: 'chicago', label: 'Chicago, IL', description: 'Moderate Midwest pricing' },
    { value: 'houston', label: 'Houston, TX', description: 'Competitive Southern rates' },
    { value: 'phoenix', label: 'Phoenix, AZ', description: 'Affordable Southwest pricing' },
    { value: 'philadelphia', label: 'Philadelphia, PA', description: 'Mid-Atlantic standard rates' },
    { value: 'san-antonio', label: 'San Antonio, TX', description: 'Budget-friendly options' },
    { value: 'san-diego', label: 'San Diego, CA', description: 'Premium coastal pricing' },
    { value: 'dallas', label: 'Dallas, TX', description: 'Competitive metropolitan rates' },
    { value: 'austin', label: 'Austin, TX', description: 'Growing market pricing' }
  ];

  const eventTypeOptions = [
    { value: 'corporate', label: 'Corporate Event', description: 'Business meetings, conferences' },
    { value: 'wedding', label: 'Wedding', description: 'Marriage ceremonies and receptions' },
    { value: 'birthday', label: 'Birthday Party', description: 'Personal celebrations' },
    { value: 'academic', label: 'Academic Event', description: 'Educational conferences, seminars' },
    { value: 'fundraiser', label: 'Fundraiser', description: 'Charity and non-profit events' },
    { value: 'product-launch', label: 'Product Launch', description: 'Business product unveiling' },
    { value: 'networking', label: 'Networking Event', description: 'Professional networking gatherings' },
    { value: 'workshop', label: 'Workshop', description: 'Educational training sessions' }
  ];

  const venueTypeOptions = [
    { value: 'hotel-ballroom', label: 'Hotel Ballroom', description: 'Luxury hotel event spaces' },
    { value: 'conference-center', label: 'Conference Center', description: 'Professional meeting facilities' },
    { value: 'restaurant', label: 'Restaurant', description: 'Private dining venues' },
    { value: 'outdoor-venue', label: 'Outdoor Venue', description: 'Gardens, parks, outdoor spaces' },
    { value: 'community-center', label: 'Community Center', description: 'Local community facilities' },
    { value: 'university-hall', label: 'University Hall', description: 'Academic institution venues' },
    { value: 'banquet-hall', label: 'Banquet Hall', description: 'Dedicated event halls' },
    { value: 'rooftop-venue', label: 'Rooftop Venue', description: 'Urban rooftop spaces' }
  ];

  const cateringTypeOptions = [
    { value: 'full-service', label: 'Full Service Catering', description: 'Complete meal service with staff' },
    { value: 'buffet', label: 'Buffet Style', description: 'Self-service buffet setup' },
    { value: 'cocktail', label: 'Cocktail Reception', description: 'Light appetizers and drinks' },
    { value: 'plated-dinner', label: 'Plated Dinner', description: 'Formal sit-down dinner service' },
    { value: 'box-lunch', label: 'Box Lunch', description: 'Individual packaged meals' },
    { value: 'coffee-break', label: 'Coffee & Pastries', description: 'Light refreshments only' },
    { value: 'no-catering', label: 'No Catering', description: 'External catering or none' }
  ];

  const eventTemplates = [
    {
      id: 'corporate-meeting',
      name: 'Corporate Meeting',
      icon: 'Building2',
      data: {
        city: 'new-york',
        audienceSize: 50,
        eventType: 'corporate',
        venueType: 'conference-center',
        cateringType: 'coffee-break',
        duration: 4,
        additionalServices: ['av-equipment', 'parking']
      }
    },
    {
      id: 'wedding-reception',
      name: 'Wedding Reception',
      icon: 'Heart',
      data: {
        city: 'los-angeles',
        audienceSize: 150,
        eventType: 'wedding',
        venueType: 'hotel-ballroom',
        cateringType: 'plated-dinner',
        duration: 8,
        additionalServices: ['photography', 'music', 'flowers']
      }
    },
    {
      id: 'academic-conference',
      name: 'Academic Conference',
      icon: 'GraduationCap',
      data: {
        city: 'chicago',
        audienceSize: 200,
        eventType: 'academic',
        venueType: 'university-hall',
        cateringType: 'buffet',
        duration: 6,
        additionalServices: ['av-equipment', 'registration']
      }
    },
    {
      id: 'product-launch',
      name: 'Product Launch',
      icon: 'Rocket',
      data: {
        city: 'san-diego',
        audienceSize: 100,
        eventType: 'product-launch',
        venueType: 'rooftop-venue',
        cateringType: 'cocktail',
        duration: 4,
        additionalServices: ['av-equipment', 'photography', 'security']
      }
    }
  ];

  const handleInputChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
  };

  const handleTemplateClick = (template) => {
    onTemplateSelect(template?.data);
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: 'Info' },
    { id: 'venue', label: 'Venue & Catering', icon: 'MapPin' },
    { id: 'services', label: 'Additional Services', icon: 'Plus' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border shadow-card">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
              <Icon name="Calculator" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Budget Calculator</h2>
              <p className="text-sm text-muted-foreground">Configure your event parameters</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onCalculate}
            loading={isCalculating}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Recalculate
          </Button>
        </div>
      </div>
      {/* Event Templates */}
      <div className="p-6 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">Quick Templates</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {eventTemplates?.map((template) => (
            <Button
              key={template?.id}
              variant="outline"
              size="sm"
              onClick={() => handleTemplateClick(template)}
              className="flex flex-col items-center space-y-1 h-auto py-3"
            >
              <Icon name={template?.icon} size={16} className="text-primary" />
              <span className="text-xs font-medium">{template?.name}</span>
            </Button>
          ))}
        </div>
      </div>
      {/* Section Navigation */}
      <div className="px-6 pt-4">
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {sections?.map((section) => (
            <button
              key={section?.id}
              onClick={() => setActiveSection(section?.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth flex-1 justify-center ${
                activeSection === section?.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={section?.icon} size={14} />
              <span>{section?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Form Content */}
      <div className="p-6">
        {/* Basic Information */}
        {activeSection === 'basic' && (
          <div className="space-y-6">
            <Select
              label="Event City"
              description="Location affects pricing and vendor availability"
              options={cityOptions}
              value={formData?.city}
              onChange={(value) => handleInputChange('city', value)}
              searchable
              required
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Expected Audience Size
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="10"
                  max="1000"
                  value={formData?.audienceSize}
                  onChange={(e) => handleInputChange('audienceSize', parseInt(e?.target?.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10 people</span>
                  <span className="font-medium text-primary">{formData?.audienceSize} people</span>
                  <span>1000+ people</span>
                </div>
              </div>
            </div>

            <Select
              label="Event Type"
              description="Event category affects service requirements"
              options={eventTypeOptions}
              value={formData?.eventType}
              onChange={(value) => handleInputChange('eventType', value)}
              required
            />

            <Input
              label="Event Duration (hours)"
              type="number"
              min="1"
              max="24"
              value={formData?.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e?.target?.value))}
              placeholder="Enter duration in hours"
              description="Total event duration including setup and cleanup"
            />
          </div>
        )}

        {/* Venue & Catering */}
        {activeSection === 'venue' && (
          <div className="space-y-6">
            <Select
              label="Venue Type"
              description="Venue category affects base rental costs"
              options={venueTypeOptions}
              value={formData?.venueType}
              onChange={(value) => handleInputChange('venueType', value)}
              required
            />

            <Select
              label="Catering Style"
              description="Catering type significantly impacts food costs"
              options={cateringTypeOptions}
              value={formData?.cateringType}
              onChange={(value) => handleInputChange('cateringType', value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Setup Time (hours)"
                type="number"
                min="0"
                max="8"
                value={formData?.setupTime || 2}
                onChange={(e) => handleInputChange('setupTime', parseInt(e?.target?.value))}
                placeholder="2"
                description="Additional setup time needed"
              />

              <Input
                label="Cleanup Time (hours)"
                type="number"
                min="0"
                max="4"
                value={formData?.cleanupTime || 1}
                onChange={(e) => handleInputChange('cleanupTime', parseInt(e?.target?.value))}
                placeholder="1"
                description="Post-event cleanup duration"
              />
            </div>
          </div>
        )}

        {/* Additional Services */}
        {activeSection === 'services' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Additional Services
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'av-equipment', label: 'AV Equipment', icon: 'Monitor' },
                  { id: 'photography', label: 'Photography', icon: 'Camera' },
                  { id: 'music', label: 'Music/DJ', icon: 'Music' },
                  { id: 'flowers', label: 'Floral Arrangements', icon: 'Flower' },
                  { id: 'security', label: 'Security', icon: 'Shield' },
                  { id: 'parking', label: 'Parking', icon: 'Car' },
                  { id: 'registration', label: 'Registration Desk', icon: 'ClipboardList' },
                  { id: 'transportation', label: 'Transportation', icon: 'Bus' }
                ]?.map((service) => (
                  <label
                    key={service?.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-smooth ${
                      formData?.additionalServices?.includes(service?.id)
                        ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData?.additionalServices?.includes(service?.id) || false}
                      onChange={(e) => {
                        const services = formData?.additionalServices || [];
                        if (e?.target?.checked) {
                          handleInputChange('additionalServices', [...services, service?.id]);
                        } else {
                          handleInputChange('additionalServices', services?.filter(s => s !== service?.id));
                        }
                      }}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                    <Icon name={service?.icon} size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{service?.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Input
              label="Special Requirements"
              type="text"
              value={formData?.specialRequirements || ''}
              onChange={(e) => handleInputChange('specialRequirements', e?.target?.value)}
              placeholder="Any special needs or custom requirements..."
              description="Additional requirements that may affect pricing"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetInputForm;