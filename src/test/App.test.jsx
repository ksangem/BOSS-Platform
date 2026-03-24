import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../BOSS_PricingIntelligence_Prototype_v1.0';

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function renderApp() {
  return render(<App />);
}

async function waitForScreen(textToFind) {
  await waitFor(() => {
    expect(screen.getByText(textToFind)).toBeInTheDocument();
  }, { timeout: 3000 });
}

async function goToPricingDashboard() {
  renderApp();
  // From Home, click the Pricing module card
  const openButtons = screen.getAllByText('Open Dashboard →');
  fireEvent.click(openButtons[0]);
  await waitForScreen('Pricing Intelligence Dashboard');
}

async function goToSimulation(partId = 'PKR-2500X') {
  await goToPricingDashboard();
  fireEvent.click(screen.getByText(partId));
  await waitForScreen('Price Simulation & Competitive Analysis');
}

// ─────────────────────────────────────────────
//  HOME SCREEN
// ─────────────────────────────────────────────
describe('Home Screen (Landing Page)', () => {
  beforeEach(() => {
    renderApp();
  });

  it('renders as the default landing page with greeting', () => {
    // The greeting text includes ", Sarah 👋" regardless of time of day
    expect(screen.getByText(/, Sarah 👋/)).toBeInTheDocument();
  });

  it('shows the BOSS Platform branding with subtitle', () => {
    expect(screen.getByText('BOSS')).toBeInTheDocument();
    expect(screen.getByText('Decision Intelligence Platform')).toBeInTheDocument();
  });

  it('shows global search bar', () => {
    expect(screen.getByPlaceholderText(/Search products, categories, alerts/)).toBeInTheDocument();
  });

  it('displays 4 Platform Health KPI cards', () => {
    expect(screen.getByText('Pricing Health')).toBeInTheDocument();
    expect(screen.getByText('Profitability')).toBeInTheDocument();
    expect(screen.getByText('Competitive Threat')).toBeInTheDocument();
    expect(screen.getByText('Product Launch')).toBeInTheDocument();
  });

  it('displays health status badges', () => {
    expect(screen.getAllByText(/Healthy|Monitor/).length).toBeGreaterThanOrEqual(2);
  });

  it('displays AI Insights panel with Opportunities and Risks', () => {
    expect(screen.getByText(/AI INSIGHTS/)).toBeInTheDocument();
    expect(screen.getByText('What Needs Your Attention Today')).toBeInTheDocument();
  });

  it('shows opportunity items', () => {
    expect(screen.getByText(/15 Valve SKUs can support/)).toBeInTheDocument();
    expect(screen.getByText('+$180K annual revenue')).toBeInTheDocument();
  });

  it('shows risk items with urgency', () => {
    expect(screen.getByText(/23 Adapter SKUs priced below/)).toBeInTheDocument();
    expect(screen.getByText('-$120K at risk')).toBeInTheDocument();
  });

  it('shows total opportunity callout', () => {
    expect(screen.getByText('$390K')).toBeInTheDocument();
    expect(screen.getByText(/across 4 modules/)).toBeInTheDocument();
  });

  it('displays 4 Module Navigation cards', () => {
    expect(screen.getAllByText('Pricing Intelligence').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Profitability Intelligence').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Competitive Intelligence').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Product Intelligence').length).toBeGreaterThanOrEqual(1);
  });

  it('shows module stats in cards', () => {
    expect(screen.getByText('18% (260 SKUs)')).toBeInTheDocument();
    expect(screen.getByText('$390K identified')).toBeInTheDocument();
  });

  it('displays Quick Actions panel', () => {
    expect(screen.getByText('Run Cross-Module Analysis')).toBeInTheDocument();
    expect(screen.getByText('Export Executive Report')).toBeInTheDocument();
  });

  it('displays Recent Activity feed', () => {
    expect(screen.getByText(/Approved pricing change for PKR-2500X/)).toBeInTheDocument();
    expect(screen.getByText(/Launched 3 new valve SKUs/)).toBeInTheDocument();
    expect(screen.getByText(/Detected Parker price change/)).toBeInTheDocument();
  });

  it('shows last login info', () => {
    expect(screen.getByText(/Last login: Friday/)).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
//  HOME → MODULE NAVIGATION
// ─────────────────────────────────────────────
describe('Home Screen Navigation', () => {
  it('navigates to Pricing Dashboard', async () => {
    renderApp();
    const openButtons = screen.getAllByText('Open Dashboard →');
    fireEvent.click(openButtons[0]);
    await waitForScreen('Pricing Intelligence Dashboard');
  });

  it('navigates to Competitive Intelligence', async () => {
    renderApp();
    const openButtons = screen.getAllByText('Open Dashboard →');
    fireEvent.click(openButtons[2]);
    await waitForScreen('Module Under Development');
  });

  it('navigates to Profitability Intelligence', async () => {
    renderApp();
    const openButtons = screen.getAllByText('Open Dashboard →');
    fireEvent.click(openButtons[1]);
    await waitForScreen('Module Under Development');
  });

  it('navigates to Product Intelligence', async () => {
    renderApp();
    const openButtons = screen.getAllByText('Open Dashboard →');
    fireEvent.click(openButtons[3]);
    await waitForScreen('Module Under Development');
  });

  it('navigates from Health KPI card to pricing dashboard', async () => {
    renderApp();
    fireEvent.click(screen.getByText('Pricing Health'));
    await waitForScreen('Pricing Intelligence Dashboard');
  });

  it('navigates back to Home from placeholder module', async () => {
    renderApp();
    const openButtons = screen.getAllByText('Open Dashboard →');
    fireEvent.click(openButtons[2]);
    await waitForScreen('Module Under Development');
    fireEvent.click(screen.getByText('← Back to Home'));
    await waitForScreen(/, Sarah 👋/);
  });

  it('navigates back to Home from Pricing Dashboard via breadcrumb', async () => {
    await goToPricingDashboard();
    fireEvent.click(screen.getByText('Home'));
    await waitForScreen(/, Sarah 👋/);
  });

  it('navigates to pricing from risk "Fix Now" button', async () => {
    renderApp();
    fireEvent.click(screen.getByText('Fix Now →'));
    await waitForScreen('Pricing Intelligence Dashboard');
  });

  it('Quick Actions show toast', async () => {
    renderApp();
    fireEvent.click(screen.getByText('Run Cross-Module Analysis'));
    await waitFor(() => {
      expect(screen.getByText(/Cross-module analysis started/)).toBeInTheDocument();
    });
  });
});

// ─────────────────────────────────────────────
//  PRICING DASHBOARD
// ─────────────────────────────────────────────
describe('Pricing Dashboard (from Home)', () => {
  it('renders dashboard with all components', async () => {
    await goToPricingDashboard();
    expect(screen.getByText('Products Below Margin Floor')).toBeInTheDocument();
    expect(screen.getByText(/AI-Powered Insights/)).toBeInTheDocument();
  });

  it('shows all 5 products in table', async () => {
    await goToPricingDashboard();
    expect(screen.getByText('PKR-2500X')).toBeInTheDocument();
    expect(screen.getByText('HSE-3301B')).toBeInTheDocument();
    expect(screen.getByText('REG-5504D')).toBeInTheDocument();
  });

  it('sorts table columns', async () => {
    await goToPricingDashboard();
    fireEvent.click(screen.getByText('Current Margin'));
    expect(screen.getByText(/Current Margin.*▲/)).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
//  SIMULATION SCREEN
// ─────────────────────────────────────────────
describe('Price Simulation (from Home)', () => {
  it('navigates Home → Dashboard → Simulation', async () => {
    await goToSimulation('PKR-2500X');
    expect(screen.getByText('PKR-2500X', { selector: 'strong' })).toBeInTheDocument();
  });

  it('shows expanded part attributes', async () => {
    await goToSimulation('PKR-2500X');
    expect(screen.getByText('Stainless Steel 316')).toBeInTheDocument();
    expect(screen.getByText('5000 PSI')).toBeInTheDocument();
    expect(screen.getByText('ISO 9001')).toBeInTheDocument();
  });

  it('shows margin floor alert', async () => {
    await goToSimulation('PKR-2500X');
    expect(screen.getByText(/Below Margin Floor — Approval required/)).toBeInTheDocument();
  });

  it('increments price with stepper', async () => {
    await goToSimulation();
    const plusButtons = screen.getAllByText('+');
    fireEvent.click(plusButtons[0]);
    expect(screen.getAllByText('$42.50').length).toBeGreaterThanOrEqual(1);
  });

  it('shows competitor benchmark', async () => {
    await goToSimulation();
    expect(screen.getByText(/Competitive Benchmark/)).toBeInTheDocument();
    expect(screen.getAllByText('Parker Hannifin').length).toBeGreaterThanOrEqual(1);
  });
});

// ─────────────────────────────────────────────
//  APPROVAL WORKFLOW
// ─────────────────────────────────────────────
describe('Approval Workflow (full flow)', () => {
  it('completes full approval flow', async () => {
    await goToSimulation('PKR-2500X');
    fireEvent.click(screen.getByText('Request Approval →'));
    expect(screen.getByText('Pricing Change Approval Required')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Submit for Approval →'));
    expect(screen.getByText('Pricing Change Submitted!')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Return to Dashboard'));
    expect(screen.getByText('Pricing Intelligence Dashboard')).toBeInTheDocument();
  });

  it('shows styled confirm dialog for above-floor pricing', async () => {
    await goToSimulation('PKR-2500X');
    const plusButtons = screen.getAllByText('+');
    for (let i = 0; i < 8; i++) fireEvent.click(plusButtons[0]);

    fireEvent.click(screen.getByText('Apply Pricing Changes →'));
    expect(screen.getByText('Apply Pricing Changes')).toBeInTheDocument();
    expect(screen.getByText('Apply Now')).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
//  QUEUE MODAL
// ─────────────────────────────────────────────
describe('Approval Queue', () => {
  it('opens queue and shows approve/reject', async () => {
    await goToPricingDashboard();
    fireEvent.click(screen.getByText('Pending Approvals').closest('div[style]'));
    expect(screen.getByText('Pending Approval Queue')).toBeInTheDocument();

    const reviewBtns = screen.getAllByText('Review');
    fireEvent.click(reviewBtns[0]);
    expect(screen.getByText('✓ Approve')).toBeInTheDocument();
    expect(screen.getByText('✗ Reject')).toBeInTheDocument();
  });

  it('approves item and shows toast', async () => {
    await goToPricingDashboard();
    fireEvent.click(screen.getByText('Pending Approvals').closest('div[style]'));
    const reviewBtns = screen.getAllByText('Review');
    fireEvent.click(reviewBtns[0]);
    fireEvent.click(screen.getByText('✓ Approve'));
    await waitFor(() => {
      expect(screen.getByText(/approved/)).toBeInTheDocument();
    });
  });
});

// ─────────────────────────────────────────────
//  AI INSIGHT DETAIL MODAL
// ─────────────────────────────────────────────
describe('AI Insight Detail Modal', () => {
  it('opens insight modal from Pricing Dashboard', async () => {
    await goToPricingDashboard();
    const viewDetailsLinks = screen.getAllByText('View Details →');
    fireEvent.click(viewDetailsLinks[0]);
    expect(screen.getByText('Affected SKUs')).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
//  KEYBOARD SHORTCUTS
// ─────────────────────────────────────────────
describe('Keyboard Shortcuts', () => {
  it('Ctrl+S saves draft on simulation', async () => {
    await goToSimulation();
    fireEvent.keyDown(document, { key: 's', ctrlKey: true });
    await waitFor(() => {
      expect(screen.getByText(/Draft saved/)).toBeInTheDocument();
    });
  });

  it('Escape closes approval modal', async () => {
    await goToSimulation('PKR-2500X');
    fireEvent.click(screen.getByText('Request Approval →'));
    expect(screen.getByText('Pricing Change Approval Required')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Pricing Change Approval Required')).not.toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
//  TOAST NOTIFICATIONS
// ─────────────────────────────────────────────
describe('Toast Notifications', () => {
  it('shows toast on home Quick Action', async () => {
    renderApp();
    fireEvent.click(screen.getByText('Export Executive Report'));
    await waitFor(() => {
      expect(screen.getByText(/Executive report generated/)).toBeInTheDocument();
    });
  });

  it('shows toast on dashboard action', async () => {
    await goToPricingDashboard();
    fireEvent.click(screen.getByText(/Schedule Review/));
    await waitFor(() => {
      expect(screen.getByText(/Review meeting scheduled/)).toBeInTheDocument();
    });
  });
});

// ─────────────────────────────────────────────
//  PART AI RECOMMENDATIONS
// ─────────────────────────────────────────────
describe('Part-Specific AI Recommendations', () => {
  it('shows correct AI insight for PKR-2500X', async () => {
    await goToSimulation('PKR-2500X');
    expect(screen.getByText('Price Increase Opportunity Detected')).toBeInTheDocument();
  });

  it('switches to VAL-8402A recommendation', async () => {
    await goToSimulation('PKR-2500X');
    const valElements = screen.getAllByText('VAL-8402A');
    fireEvent.click(valElements[0]);
    expect(screen.getAllByText(/Hold & Monitor/).length).toBeGreaterThanOrEqual(1);
  });
});

// ─────────────────────────────────────────────
//  EDGE CASES
// ─────────────────────────────────────────────
describe('Edge Cases', () => {
  it('renders without crashing', () => {
    const { container } = renderApp();
    expect(container).toBeInTheDocument();
  });

  it('handles full navigation cycle: Home → Pricing → Simulate → Back → Home', async () => {
    await goToSimulation('PKR-2500X');

    fireEvent.click(screen.getByText(/Back to Dashboard/));
    await waitForScreen('Pricing Intelligence Dashboard');

    fireEvent.click(screen.getByText('Home'));
    await waitForScreen(/, Sarah 👋/);
  });

  it('visits all 4 modules from Home', async () => {
    renderApp();

    // Visit Pricing
    let openButtons = screen.getAllByText('Open Dashboard →');
    fireEvent.click(openButtons[0]);
    await waitForScreen('Pricing Intelligence Dashboard');
    fireEvent.click(screen.getByText('Home'));
    await waitForScreen(/, Sarah 👋/);

    // Visit Profitability
    openButtons = screen.getAllByText('Open Dashboard →');
    fireEvent.click(openButtons[1]);
    await waitForScreen('Module Under Development');
    fireEvent.click(screen.getByText('← Back to Home'));
    await waitForScreen(/, Sarah 👋/);

    // Visit Competitive
    openButtons = screen.getAllByText('Open Dashboard →');
    fireEvent.click(openButtons[2]);
    await waitForScreen('Module Under Development');
    fireEvent.click(screen.getByText('← Back to Home'));
    await waitForScreen(/, Sarah 👋/);

    // Visit Product
    openButtons = screen.getAllByText('Open Dashboard →');
    fireEvent.click(openButtons[3]);
    await waitForScreen('Module Under Development');
    fireEvent.click(screen.getByText('← Back to Home'));
    await waitForScreen(/, Sarah 👋/);
  });
});
