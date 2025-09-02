import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EmailInvitationTab = () => {
  const [selectedTone, setSelectedTone] = useState('formal');
  const [selectedTemplate, setSelectedTemplate] = useState('corporate');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const toneOptions = [
    { value: 'formal', label: 'Formal' },
    { value: 'informal', label: 'Informal' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'professional', label: 'Professional' }
  ];

  const templateOptions = [
    { value: 'corporate', label: 'Corporate Event' },
    { value: 'birthday', label: 'Birthday Party' },
    { value: 'wedding', label: 'Wedding Celebration' },
    { value: 'conference', label: 'Conference/Seminar' },
    { value: 'networking', label: 'Networking Event' }
  ];

  const mockEmailContent = {
    formal: {
      subject: "Invitation to Annual Tech Conference 2025",
      content: `Dear Valued Guest,\n\nWe cordially invite you to attend our Annual Tech Conference 2025, scheduled for March 15th, 2025, at the Grand Convention Center.\n\nThis prestigious event will feature:\n• Keynote speeches from industry leaders\n• Interactive workshops and panel discussions\n• Networking opportunities with professionals\n• Exhibition of cutting-edge technologies\n\nEvent Details:\nDate: March 15th, 2025\nTime: 9:00 AM - 6:00 PM\nVenue: Grand Convention Center, Downtown\nDress Code: Business Formal\n\nPlease confirm your attendance by March 10th, 2025.\n\nWe look forward to your presence at this remarkable event.\n\nSincerely,\nEvent Planning Committee\nSmart Event Planner`
    },
    informal: {
      subject: "You\'re Invited! 🎉 Annual Tech Conference 2025",
      content: `Hey there!\n\nGuess what? You're invited to our awesome Annual Tech Conference 2025! 🚀\n\nWe're throwing this amazing event on March 15th at the Grand Convention Center, and we'd love to have you there!\n\nWhat's in store:\n• Mind-blowing keynotes from tech rockstars\n• Hands-on workshops (bring your laptop!)\n• Epic networking sessions with free coffee ☕\n• The coolest tech demos you've ever seen\n\nQuick Details:\n📅 March 15th, 2025\n⏰ 9:00 AM - 6:00 PM\n📍 Grand Convention Center, Downtown\n👔 Business casual (comfort is key!)\n\nJust hit reply and let us know you're coming by March 10th!\n\nCan't wait to see you there!\n\nCheers,\nThe Event Team 🎊\nSmart Event Planner`
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const content = mockEmailContent?.[selectedTone] || mockEmailContent?.formal;
      setGeneratedContent(content);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSendEmail = () => {
    // Mock send functionality
    alert(`Email would be sent to: ${recipientEmail}`);
  };

  const handleCopyContent = () => {
    if (generatedContent) {
      navigator.clipboard?.writeText(`Subject: ${generatedContent?.subject}\n\n${generatedContent?.content}`);
      alert('Email content copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Mail" size={20} className="mr-2 text-primary" />
          Email Invitation Generator
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Select
            label="Email Tone"
            options={toneOptions}
            value={selectedTone}
            onChange={setSelectedTone}
          />
          
          <Select
            label="Event Template"
            options={templateOptions}
            value={selectedTemplate}
            onChange={setSelectedTemplate}
          />
        </div>

        <Button
          onClick={handleGenerate}
          loading={isGenerating}
          iconName="Sparkles"
          iconPosition="left"
          className="w-full md:w-auto"
        >
          {isGenerating ? 'Generating Email...' : 'Generate Invitation'}
        </Button>
      </div>
      {/* Generated Content */}
      {generatedContent && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Generated Email</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyContent}
                iconName="Copy"
                iconPosition="left"
              >
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Regenerate
              </Button>
            </div>
          </div>

          {/* Email Preview */}
          <div className="bg-muted rounded-lg p-4 mb-4">
            <div className="border-b border-border pb-3 mb-3">
              <div className="text-sm text-muted-foreground mb-1">Subject:</div>
              <div className="font-medium text-foreground">{generatedContent?.subject}</div>
            </div>
            <div className="whitespace-pre-line text-sm text-foreground leading-relaxed">
              {generatedContent?.content}
            </div>
          </div>

          {/* Send Options */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="email"
                label="Recipient Email"
                placeholder="Enter recipient email address"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e?.target?.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSendEmail}
                disabled={!recipientEmail}
                iconName="Send"
                iconPosition="left"
              >
                Send Email
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Empty State */}
      {!generatedContent && !isGenerating && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Mail" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Email Generated Yet</h3>
          <p className="text-muted-foreground mb-4">
            Select your preferred tone and template, then click generate to create your invitation email.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailInvitationTab;