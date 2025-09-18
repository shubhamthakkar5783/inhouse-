import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetComparison = ({ 
  scenarios = [], 
  onAddScenario, 
  onRemoveScenario, 
  onSelectScenario,
  activeScenario = 0,
  onExportComparison,
  onShareScenarios,
  onClearAll
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const getScenarioColor = (index) => {
    const colors = [
      'border-primary bg-primary/5 text-primary',
      'border-secondary bg-secondary/5 text-secondary',
      'border-accent bg-accent/5 text-accent',
      'border-warning bg-warning/5 text-warning'
    ];
    return colors?.[index % colors?.length];
  };

  const getComparisonInsights = () => {
    if (scenarios?.length < 2) return null;

    const costs = scenarios?.map(s => s?.grandTotal);
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    const avgCost = costs?.reduce((sum, cost) => sum + cost, 0) / costs?.length;
    const savings = maxCost - minCost;

    return {
      minCost,
      maxCost,
      avgCost,
      savings,
      cheapestIndex: costs?.indexOf(minCost),
      expensiveIndex: costs?.indexOf(maxCost)
    };
  };

  const insights = getComparisonInsights();

  const handleExportComparison = async () => {
    if (!onExportComparison) return;
    
    setIsExporting(true);
    try {
      await onExportComparison(scenarios, insights);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareScenarios = () => {
    if (onShareScenarios) {
      onShareScenarios(scenarios);
    }
    setShareModalOpen(true);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all scenarios? This action cannot be undone.')) {
      if (onClearAll) {
        onClearAll();
      }
    }
  };

  if (scenarios?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-card p-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-lg mx-auto mb-4">
            <Icon name="BarChart3" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Scenarios to Compare</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create multiple budget scenarios to compare costs and options
          </p>
          <Button
            variant="outline"
            onClick={onAddScenario}
            iconName="Plus"
            iconPosition="left"
          >
            Create First Scenario
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-card">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
              <Icon name="BarChart3" size={20} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Budget Comparison</h2>
              <p className="text-sm text-muted-foreground">
                Compare {scenarios?.length} scenario{scenarios?.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddScenario}
              iconName="Plus"
              iconPosition="left"
            >
              Add Scenario
            </Button>
          </div>
        </div>
      </div>
      {/* Comparison Insights */}
      {insights && (
        <div className="p-6 border-b border-border bg-muted/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Lowest Cost</p>
              <p className="text-lg font-semibold text-success">
                {formatCurrency(insights?.minCost)}
              </p>
              <p className="text-xs text-muted-foreground">
                Scenario {insights?.cheapestIndex + 1}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Highest Cost</p>
              <p className="text-lg font-semibold text-error">
                {formatCurrency(insights?.maxCost)}
              </p>
              <p className="text-xs text-muted-foreground">
                Scenario {insights?.expensiveIndex + 1}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Average Cost</p>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(insights?.avgCost)}
              </p>
              <p className="text-xs text-muted-foreground">
                Across all scenarios
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Potential Savings</p>
              <p className="text-lg font-semibold text-warning">
                {formatCurrency(insights?.savings)}
              </p>
              <p className="text-xs text-muted-foreground">
                Max vs Min
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Scenario Cards */}
      <div className="p-6">
        <div className={`grid gap-4 ${isExpanded ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          {scenarios?.map((scenario, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 cursor-pointer transition-smooth ${
                activeScenario === index
                  ? getScenarioColor(index)
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onSelectScenario(index)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    activeScenario === index ? 'bg-current' : 'bg-muted-foreground'
                  }`} />
                  <h3 className="font-semibold text-foreground">
                    {scenario?.name || `Scenario ${index + 1}`}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-foreground">
                    {formatCurrency(scenario?.grandTotal)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e?.stopPropagation();
                      onRemoveScenario(index);
                    }}
                    className="w-6 h-6 text-muted-foreground hover:text-error"
                  >
                    <Icon name="X" size={12} />
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">City</p>
                      <p className="font-medium text-foreground">
                        {scenario?.formData?.city?.replace('-', ' ') || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Guests</p>
                      <p className="font-medium text-foreground">
                        {scenario?.formData?.audienceSize || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Event Type</p>
                      <p className="font-medium text-foreground">
                        {scenario?.formData?.eventType?.replace('-', ' ') || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium text-foreground">
                        {scenario?.formData?.duration || 0}h
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Venue & Facilities</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(scenario?.venue?.total || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Catering & Service</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(scenario?.catering?.total || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Additional Services</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(scenario?.services?.total || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Miscellaneous</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(scenario?.miscellaneous?.total || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Per Guest Cost</span>
                      <span className="font-semibold text-foreground">
                        {formatCurrency(
                          scenario?.formData?.audienceSize > 0 
                            ? scenario?.grandTotal / scenario?.formData?.audienceSize 
                            : 0
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {!isExpanded && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {scenario?.formData?.audienceSize || 0} guests • {scenario?.formData?.duration || 0}h
                  </span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(
                      scenario?.formData?.audienceSize > 0 
                        ? scenario?.grandTotal / scenario?.formData?.audienceSize 
                        : 0
                    )}/guest
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="p-6 border-t border-border bg-muted/20">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportComparison}
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
            disabled={scenarios?.length === 0}
          >
            {isExporting ? 'Exporting...' : 'Export Comparison'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareScenarios}
            iconName="Share2"
            iconPosition="left"
            disabled={scenarios?.length === 0}
          >
            Share Scenarios
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            iconName="Trash2"
            iconPosition="left"
            disabled={scenarios?.length === 0}
            className="text-error hover:text-error"
          >
            Clear All
          </Button>
        </div>
        
        {scenarios?.length > 0 && (
          <div className="mt-3 text-xs text-muted-foreground">
            <Icon name="Info" size={12} className="inline mr-1" />
            Compare up to 5 scenarios to find the best option for your event budget.
          </div>
        )}
      </div>
      
      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-1200 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShareModalOpen(false)} />
          <div className="relative bg-card rounded-lg shadow-modal w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Share Budget Scenarios</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShareModalOpen(false)}
                className="w-8 h-8"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  navigator.clipboard?.writeText(window.location?.href);
                  alert('Link copied to clipboard!');
                }}
                iconName="Copy"
                iconPosition="left"
              >
                Copy Share Link
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  const subject = 'Budget Comparison - Smart Event Planner';
                  const body = `Check out these budget scenarios: ${window.location?.href}`;
                  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                }}
                iconName="Mail"
                iconPosition="left"
              >
                Share via Email
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetComparison;