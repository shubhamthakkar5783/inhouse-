import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetComparison = ({ 
  scenarios = [], 
  onAddScenario, 
  onRemoveScenario, 
  onSelectScenario,
  activeScenario = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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
            onClick={() => {/* Export comparison */}}
            iconName="Download"
            iconPosition="left"
          >
            Export Comparison
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Share scenarios */}}
            iconName="Share2"
            iconPosition="left"
          >
            Share Scenarios
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Clear all */}}
            iconName="Trash2"
            iconPosition="left"
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BudgetComparison;