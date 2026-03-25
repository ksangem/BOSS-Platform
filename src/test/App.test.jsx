import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    await waitForScreen('Launch Pipeline');
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

  it('visits all 4 modules from Home', { timeout: 15000 }, async () => {
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
    await waitForScreen('Launch Pipeline');
    fireEvent.click(screen.getByText('← Back to Home'));
    await waitForScreen(/, Sarah 👋/);
  });
});

// ─────────────────────────────────────────────
//  PRODUCT INTELLIGENCE — HELPERS
// ─────────────────────────────────────────────
async function goToProductIntelligence() {
  renderApp();
  const openButtons = screen.getAllByText('Open Dashboard →');
  fireEvent.click(openButtons[3]);
  await waitForScreen(/Ready to Launch/);
}

async function clickPiTab(tabName) {
  // Tab buttons have emoji + label — use userEvent for realistic click behavior
  const user = userEvent.setup();
  const btn = screen.getByRole('button', { name: new RegExp(tabName) });
  await user.click(btn);
}

// ─────────────────────────────────────────────
//  PRODUCT INTELLIGENCE — LAUNCH PIPELINE (Feature 2)
// ─────────────────────────────────────────────
describe('Product Intelligence — Launch Pipeline Dashboard', () => {
  it('renders Product Intelligence with KPI cards', async () => {
    await goToProductIntelligence();
    expect(screen.getByText('Launch Velocity')).toBeInTheDocument();
    expect(screen.getByText('Attribute Completeness')).toBeInTheDocument();
    expect(screen.getByText('Launch-Ready')).toBeInTheDocument();
    expect(screen.getByText('Blocked Products')).toBeInTheDocument();
  });

  it('shows 5 tab navigation buttons', async () => {
    await goToProductIntelligence();
    expect(screen.getByRole('button', { name: /Launch Pipeline/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /AI Extraction/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cross-Reference/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Assemblies/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Supplier Portal/ })).toBeInTheDocument();
  });

  it('shows Ready to Launch section with green products', async () => {
    await goToProductIntelligence();
    expect(screen.getByText(/Ready to Launch/)).toBeInTheDocument();
    expect(screen.getByText('VLV-316-NPT50-5K-001')).toBeInTheDocument();
    expect(screen.getByText('VLV-316-NPT50-5K-002')).toBeInTheDocument();
    expect(screen.getByText('VLV-316-NPT50-5K-003')).toBeInTheDocument();
  });

  it('shows In Progress section with yellow products', async () => {
    await goToProductIntelligence();
    expect(screen.getByText(/In Progress/)).toBeInTheDocument();
    expect(screen.getByText('HSE-304-JIC12-3K-045')).toBeInTheDocument();
    expect(screen.getByText('FTG-316-ORF10-6K-128')).toBeInTheDocument();
  });

  it('shows Blocked section with red products and blockers', async () => {
    await goToProductIntelligence();
    expect(screen.getByText(/Blocked \(2 products\)/)).toBeInTheDocument();
    expect(screen.getByText(/CPL-STEEL-CAM40-4K-201/)).toBeInTheDocument();
    expect(screen.getByText(/Supplier not responding/)).toBeInTheDocument();
    expect(screen.getByText(/Missing material certification/)).toBeInTheDocument();
  });

  it('shows completeness percentages on in-progress products', async () => {
    await goToProductIntelligence();
    expect(screen.getByText('87%')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
  });

  it('shows missing fields on in-progress products', async () => {
    await goToProductIntelligence();
    expect(screen.getByText(/Material Certification/)).toBeInTheDocument();
    expect(screen.getByText(/Supplier Cost/)).toBeInTheDocument();
  });

  it('opens product detail modal on click', async () => {
    await goToProductIntelligence();
    const viewButtons = screen.getAllByText('View Details');
    fireEvent.click(viewButtons[0]);
    await waitFor(() => {
      expect(screen.getByText('Launch Readiness')).toBeInTheDocument();
      expect(screen.getAllByText(/100% Complete/).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('product detail modal shows attributes with confidence scores', async () => {
    await goToProductIntelligence();
    const viewButtons = screen.getAllByText('View Details');
    fireEvent.click(viewButtons[0]);
    await waitFor(() => {
      expect(screen.getAllByText('316 Stainless Steel').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('5000 PSI').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('product detail modal shows NetSuite sync status', async () => {
    await goToProductIntelligence();
    const viewButtons = screen.getAllByText('View Details');
    fireEvent.click(viewButtons[0]);
    await waitFor(() => {
      // First ready product (VLV-001) has sync:"synced"
      expect(screen.getByText(/Synced to NetSuite|Pending NetSuite Sync/)).toBeInTheDocument();
    });
  });

  it('product detail modal shows competitive equivalents', async () => {
    await goToProductIntelligence();
    const viewButtons = screen.getAllByText('View Details');
    fireEvent.click(viewButtons[0]);
    await waitFor(() => {
      expect(screen.getAllByText('PKR-2500X').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('89% match')).toBeInTheDocument();
    });
  });

  it('closes product detail modal', async () => {
    await goToProductIntelligence();
    const viewButtons = screen.getAllByText('View Details');
    fireEvent.click(viewButtons[0]);
    await waitFor(() => {
      expect(screen.getByText('Launch Readiness')).toBeInTheDocument();
    });
    const closeBtns = screen.getAllByText('Close');
    fireEvent.click(closeBtns[closeBtns.length - 1]);
    await waitFor(() => {
      expect(screen.queryByText('Launch Readiness')).not.toBeInTheDocument();
    });
  });

  it('escalate button on blocked product shows toast', async () => {
    await goToProductIntelligence();
    const escalateButtons = screen.getAllByText('Escalate');
    fireEvent.click(escalateButtons[0]);
    await waitFor(() => {
      expect(screen.getByText(/Escalation email sent/)).toBeInTheDocument();
    });
  });
});

// ─────────────────────────────────────────────
//  PRODUCT INTELLIGENCE — NETSUITE AUTO-SYNC (Feature 4)
// ─────────────────────────────────────────────
describe('Product Intelligence — NetSuite Auto-Sync', () => {
  it('shows Launch Now button on ready products not yet synced', async () => {
    await goToProductIntelligence();
    const launchButtons = screen.getAllByText('Launch Now');
    expect(launchButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('shows Launch All button', async () => {
    await goToProductIntelligence();
    expect(screen.getByText(/Launch All/)).toBeInTheDocument();
  });

  it('clicking Launch Now opens confirmation dialog', async () => {
    await goToProductIntelligence();
    const launchButtons = screen.getAllByText('Launch Now');
    fireEvent.click(launchButtons[0]);
    await waitFor(() => {
      expect(screen.getByText('Launch Product to NetSuite')).toBeInTheDocument();
      expect(screen.getByText(/Create item record in NetSuite/)).toBeInTheDocument();
    });
  });

  it('confirming launch shows success toast', async () => {
    await goToProductIntelligence();
    const launchButtons = screen.getAllByText('Launch Now');
    fireEvent.click(launchButtons[0]);
    await waitFor(() => {
      expect(screen.getByText('Launch Product to NetSuite')).toBeInTheDocument();
    });
    // The confirm dialog has its own "Launch Now" button
    const allLaunch = screen.getAllByText('Launch Now');
    fireEvent.click(allLaunch[allLaunch.length - 1]);
    await waitFor(() => {
      expect(screen.getByText(/synced to NetSuite/)).toBeInTheDocument();
    });
  });

  it('Launch All syncs all ready products and shows toast', async () => {
    await goToProductIntelligence();
    fireEvent.click(screen.getByText(/Launch All/));
    await waitFor(() => {
      expect(screen.getByText(/products synced to NetSuite/)).toBeInTheDocument();
    });
  });

  it('after Launch All, ready section shows empty state', async () => {
    await goToProductIntelligence();
    fireEvent.click(screen.getByText(/Launch All/));
    await waitFor(() => {
      expect(screen.getByText(/All launch-ready products have been synced/)).toBeInTheDocument();
    });
  });
});

// ─────────────────────────────────────────────
//  PRODUCT INTELLIGENCE — AI EXTRACTION (Feature 1)
// ─────────────────────────────────────────────
describe('Product Intelligence — AI PDF Extraction', () => {
  it('navigates to AI Extraction tab', async () => {
    await goToProductIntelligence();
    await clickPiTab('AI Extraction');
    await waitFor(() => {
      expect(screen.getByText(/AI-Powered PDF Spec Extraction/)).toBeInTheDocument();
    });
  });

  it('shows upload zone on extraction tab', async () => {
    await goToProductIntelligence();
    await clickPiTab('AI Extraction');
    await waitFor(() => {
      expect(screen.getByText('Drop Supplier Spec Sheet Here')).toBeInTheDocument();
      expect(screen.getByText(/PDF, Excel, CSV/)).toBeInTheDocument();
    });
  });

  it('shows recent extraction history', async () => {
    await goToProductIntelligence();
    await clickPiTab('AI Extraction');
    await waitFor(() => {
      expect(screen.getByText('Recent Extractions')).toBeInTheDocument();
      expect(screen.getByText('AcmeValves_Q1_2026_Specs.pdf')).toBeInTheDocument();
      expect(screen.getByText('FlexLine_Hose_Catalog.pdf')).toBeInTheDocument();
    });
  });

  it('shows extraction confidence percentages in history', async () => {
    await goToProductIntelligence();
    await clickPiTab('AI Extraction');
    await waitFor(() => {
      expect(screen.getByText('91% avg confidence')).toBeInTheDocument();
      expect(screen.getByText('94% avg confidence')).toBeInTheDocument();
    });
  });

  it('clicking upload opens extraction review', async () => {
    await goToProductIntelligence();
    await clickPiTab('AI Extraction');
    await waitFor(() => {
      expect(screen.getByText('Drop Supplier Spec Sheet Here')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Click to Upload & Extract (Demo)'));
    await waitFor(() => {
      expect(screen.getByText(/AI Extraction Review/)).toBeInTheDocument();
    });
  });

  it('extraction review shows products with attributes and confidence', async () => {
    await goToProductIntelligence();
    await clickPiTab('AI Extraction');
    await waitFor(() => {
      expect(screen.getByText('Drop Supplier Spec Sheet Here')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Click to Upload & Extract (Demo)'));
    await waitFor(() => {
      expect(screen.getByText(/Product 1 of 3/)).toBeInTheDocument();
      expect(screen.getAllByText(/Extracted Attributes/).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('extraction review shows Edit buttons for attributes', async () => {
    await goToProductIntelligence();
    await clickPiTab('AI Extraction');
    await waitFor(() => {
      expect(screen.getByText('Drop Supplier Spec Sheet Here')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Click to Upload & Extract (Demo)'));
    await waitFor(() => {
      const editButtons = screen.getAllByText('Edit');
      expect(editButtons.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('clicking Edit on attribute shows inline editor', async () => {
    await goToProductIntelligence();
    await clickPiTab('AI Extraction');
    await waitFor(() => {
      expect(screen.getByText('Drop Supplier Spec Sheet Here')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Click to Upload & Extract (Demo)'));
    await waitFor(() => {
      expect(screen.getAllByText('Edit').length).toBeGreaterThanOrEqual(1);
    });
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });

  it('approving individual product shows toast', async () => {
    await goToProductIntelligence();
    await clickPiTab('AI Extraction');
    await waitFor(() => {
      expect(screen.getByText('Drop Supplier Spec Sheet Here')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Click to Upload & Extract (Demo)'));
    await waitFor(() => {
      expect(screen.getAllByText('Approve Product').length).toBeGreaterThanOrEqual(1);
    });
    const approveButtons = screen.getAllByText('Approve Product');
    fireEvent.click(approveButtons[0]);
    await waitFor(() => {
      expect(screen.getByText(/approved/)).toBeInTheDocument();
    });
  });

  it('Approve All approves entire batch with toast', async () => {
    await goToProductIntelligence();
    await clickPiTab('AI Extraction');
    await waitFor(() => {
      expect(screen.getByText('Drop Supplier Spec Sheet Here')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Click to Upload & Extract (Demo)'));
    await waitFor(() => {
      expect(screen.getByText(/Approve All/)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Approve All/));
    await waitFor(() => {
      expect(screen.getByText(/products approved/)).toBeInTheDocument();
    });
  });

  it('extraction review shows AI-matched competitive equivalents', async () => {
    await goToProductIntelligence();
    await clickPiTab('AI Extraction');
    await waitFor(() => {
      expect(screen.getByText('Drop Supplier Spec Sheet Here')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Click to Upload & Extract (Demo)'));
    await waitFor(() => {
      expect(screen.getAllByText(/AI-Matched Competitive Equivalents/).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('closing extraction review returns to upload zone', async () => {
    await goToProductIntelligence();
    await clickPiTab('AI Extraction');
    await waitFor(() => {
      expect(screen.getByText('Drop Supplier Spec Sheet Here')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Click to Upload & Extract (Demo)'));
    await waitFor(() => {
      expect(screen.getByText(/AI Extraction Review/)).toBeInTheDocument();
    });
    const closeBtns = screen.getAllByRole('button', { name: /Close/ });
    fireEvent.click(closeBtns[closeBtns.length - 1]);
    await waitFor(() => {
      expect(screen.getByText('Drop Supplier Spec Sheet Here')).toBeInTheDocument();
    });
  });
});

// ─────────────────────────────────────────────
//  PRODUCT INTELLIGENCE — CROSS-REFERENCE (Feature 3)
// ─────────────────────────────────────────────
describe('Product Intelligence — Competitive Cross-Reference', () => {
  it('navigates to Cross-Reference tab', async () => {
    await goToProductIntelligence();
    await clickPiTab('Cross-Reference');
    await waitFor(() => {
      expect(screen.getByText(/Competitive Equivalency Mapping/)).toBeInTheDocument();
    });
  });

  it('shows search input and full database table', async () => {
    await goToProductIntelligence();
    await clickPiTab('Cross-Reference');
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter competitor part number/)).toBeInTheDocument();
      expect(screen.getByText('Full Cross-Reference Database')).toBeInTheDocument();
    });
  });

  it('shows cross-reference database with entries', async () => {
    await goToProductIntelligence();
    await clickPiTab('Cross-Reference');
    await waitFor(() => {
      expect(screen.getAllByText('PKR-2500X').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('SS-43VF4').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows product gap indicator for unmatched competitor SKU', async () => {
    await goToProductIntelligence();
    await clickPiTab('Cross-Reference');
    await waitFor(() => {
      expect(screen.getByText('Gap')).toBeInTheDocument();
    });
  });

  it('searching for competitor SKU shows match result', async () => {
    await goToProductIntelligence();
    await clickPiTab('Cross-Reference');
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter competitor part number/)).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(/Enter competitor part number/);
    fireEvent.change(input, { target: { value: 'PKR-2500X' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => {
      expect(screen.getByText(/Brennan Equivalent Found/)).toBeInTheDocument();
    });
  });

  it('cross-reference result shows price comparison with savings', async () => {
    await goToProductIntelligence();
    await clickPiTab('Cross-Reference');
    const input = screen.getByPlaceholderText(/Enter competitor part number/);
    fireEvent.change(input, { target: { value: 'PKR-2500X' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => {
      expect(screen.getByText('$25.50')).toBeInTheDocument();
      expect(screen.getByText('$28.75')).toBeInTheDocument();
      expect(screen.getByText(/Your Savings/)).toBeInTheDocument();
    });
  });

  it('cross-reference result shows spec comparison table', async () => {
    await goToProductIntelligence();
    await clickPiTab('Cross-Reference');
    const input = screen.getByPlaceholderText(/Enter competitor part number/);
    fireEvent.change(input, { target: { value: 'PKR-2500X' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => {
      expect(screen.getByText('Specification Comparison')).toBeInTheDocument();
      expect(screen.getAllByText('316 Stainless Steel').length).toBeGreaterThanOrEqual(2);
    });
  });

  it('shows stock availability for matched product', async () => {
    await goToProductIntelligence();
    await clickPiTab('Cross-Reference');
    const input = screen.getByPlaceholderText(/Enter competitor part number/);
    fireEvent.change(input, { target: { value: 'PKR-2500X' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => {
      expect(screen.getByText(/450 units ready to ship/)).toBeInTheDocument();
    });
  });

  it('search with Enter key works', async () => {
    await goToProductIntelligence();
    await clickPiTab('Cross-Reference');
    const input = screen.getByPlaceholderText(/Enter competitor part number/);
    fireEvent.change(input, { target: { value: 'PKR-2610X' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => {
      expect(screen.getByText(/Brennan Equivalent Found/)).toBeInTheDocument();
    });
  });

  it('searching for unknown SKU shows no match state', async () => {
    await goToProductIntelligence();
    await clickPiTab('Cross-Reference');
    const input = screen.getByPlaceholderText(/Enter competitor part number/);
    fireEvent.change(input, { target: { value: 'UNKNOWN-99999' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => {
      expect(screen.getByText('No Brennan Equivalent Found')).toBeInTheDocument();
    });
  });

  it('clicking View Match in database table shows result', async () => {
    await goToProductIntelligence();
    await clickPiTab('Cross-Reference');
    await waitFor(() => {
      const viewLinks = screen.getAllByText('View Match');
      fireEvent.click(viewLinks[0]);
    });
    await waitFor(() => {
      expect(screen.getByText(/Brennan Equivalent Found/)).toBeInTheDocument();
    });
  });

  it('Add to Quote button shows toast', async () => {
    await goToProductIntelligence();
    await clickPiTab('Cross-Reference');
    const input = screen.getByPlaceholderText(/Enter competitor part number/);
    fireEvent.change(input, { target: { value: 'PKR-2500X' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => {
      expect(screen.getByText('Add to Quote')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Add to Quote'));
    await waitFor(() => {
      expect(screen.getByText(/added to quote/)).toBeInTheDocument();
    });
  });
});

// ─────────────────────────────────────────────
//  PRODUCT INTELLIGENCE — ASSEMBLIES (Feature 6)
// ─────────────────────────────────────────────
describe('Product Intelligence — Assembly/BOM Management', () => {
  it('navigates to Assemblies tab', async () => {
    await goToProductIntelligence();
    await clickPiTab('Assemblies');
    await waitFor(() => {
      expect(screen.getByText('3 assemblies configured')).toBeInTheDocument();
    });
  });

  it('shows all 3 assemblies', async () => {
    await goToProductIntelligence();
    await clickPiTab('Assemblies');
    await waitFor(() => {
      expect(screen.getByText('HYD-ASM-KIT-5000PSI-12FT')).toBeInTheDocument();
      expect(screen.getByText('VLV-KIT-CTRL-3WAY')).toBeInTheDocument();
      expect(screen.getByText('FTG-KIT-METRIC-CONV')).toBeInTheDocument();
    });
  });

  it('shows assembly status badges', async () => {
    await goToProductIntelligence();
    await clickPiTab('Assemblies');
    await waitFor(() => {
      const activeBadges = screen.getAllByText('Active');
      expect(activeBadges.length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('Draft')).toBeInTheDocument();
    });
  });

  it('shows NetSuite sync status on synced assemblies', async () => {
    await goToProductIntelligence();
    await clickPiTab('Assemblies');
    await waitFor(() => {
      expect(screen.getByText(/NetSuite #10501/)).toBeInTheDocument();
    });
  });

  it('expanding assembly shows component list', async () => {
    await goToProductIntelligence();
    await clickPiTab('Assemblies');
    await waitFor(() => {
      expect(screen.getByText('HYD-ASM-KIT-5000PSI-12FT')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('HYD-ASM-KIT-5000PSI-12FT'));
    await waitFor(() => {
      expect(screen.getByText('Components (8 items)')).toBeInTheDocument();
      expect(screen.getByText('HSE-304-3K-144')).toBeInTheDocument();
      expect(screen.getByText('FTG-316-JIC12')).toBeInTheDocument();
    });
  });

  it('expanded assembly shows cost rollup', async () => {
    await goToProductIntelligence();
    await clickPiTab('Assemblies');
    fireEvent.click(screen.getByText('HYD-ASM-KIT-5000PSI-12FT'));
    await waitFor(() => {
      expect(screen.getByText('Component Cost')).toBeInTheDocument();
      expect(screen.getByText('Assembly Labor')).toBeInTheDocument();
      expect(screen.getByText('Total Cost')).toBeInTheDocument();
    });
  });

  it('expanded assembly shows price and margin', async () => {
    await goToProductIntelligence();
    await clickPiTab('Assemblies');
    fireEvent.click(screen.getByText('HYD-ASM-KIT-5000PSI-12FT'));
    await waitFor(() => {
      expect(screen.getByText(/44\.1% margin/)).toBeInTheDocument();
    });
  });

  it('collapsing assembly hides component list', async () => {
    await goToProductIntelligence();
    await clickPiTab('Assemblies');
    fireEvent.click(screen.getByText('HYD-ASM-KIT-5000PSI-12FT'));
    await waitFor(() => {
      expect(screen.getByText('Components (8 items)')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('HYD-ASM-KIT-5000PSI-12FT'));
    await waitFor(() => {
      expect(screen.queryByText('Components (8 items)')).not.toBeInTheDocument();
    });
  });

  it('draft assembly shows Sync to NetSuite button', async () => {
    await goToProductIntelligence();
    await clickPiTab('Assemblies');
    fireEvent.click(screen.getByText('VLV-KIT-CTRL-3WAY'));
    await waitFor(() => {
      expect(screen.getByText('Sync to NetSuite →')).toBeInTheDocument();
    });
  });

  it('New Assembly button shows toast', async () => {
    await goToProductIntelligence();
    await clickPiTab('Assemblies');
    fireEvent.click(screen.getByText('+ New Assembly'));
    await waitFor(() => {
      expect(screen.getByText(/Opening Assembly Builder/)).toBeInTheDocument();
    });
  });

  it('Export BOM button shows toast', async () => {
    await goToProductIntelligence();
    await clickPiTab('Assemblies');
    fireEvent.click(screen.getByText('HYD-ASM-KIT-5000PSI-12FT'));
    await waitFor(() => {
      expect(screen.getByText(/Export BOM/)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Export BOM/));
    await waitFor(() => {
      expect(screen.getByText(/exported as CSV/)).toBeInTheDocument();
    });
  });
});

// ─────────────────────────────────────────────
//  PRODUCT INTELLIGENCE — SUPPLIER PORTAL (Feature 5)
// ─────────────────────────────────────────────
describe('Product Intelligence — Supplier Portal', () => {
  it('navigates to Supplier Portal tab', async () => {
    await goToProductIntelligence();
    await clickPiTab('Supplier Portal');
    await waitFor(() => {
      expect(screen.getByText(/Supplier Directory/)).toBeInTheDocument();
    });
  });

  it('shows supplier stats KPI cards', async () => {
    await goToProductIntelligence();
    await clickPiTab('Supplier Portal');
    await waitFor(() => {
      expect(screen.getByText('Active Suppliers')).toBeInTheDocument();
      expect(screen.getByText('Total Products')).toBeInTheDocument();
      expect(screen.getByText('Pending Approval')).toBeInTheDocument();
      expect(screen.getByText('Approval Rate')).toBeInTheDocument();
    });
  });

  it('shows all suppliers in table', async () => {
    await goToProductIntelligence();
    await clickPiTab('Supplier Portal');
    await waitFor(() => {
      expect(screen.getByText('Acme Hydraulics')).toBeInTheDocument();
      expect(screen.getByText('FlexLine Corp')).toBeInTheDocument();
      expect(screen.getByText('SteelMax Corp')).toBeInTheDocument();
    });
  });

  it('shows supplier contact info', async () => {
    await goToProductIntelligence();
    await clickPiTab('Supplier Portal');
    await waitFor(() => {
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.getByText('john@acmehydraulics.com')).toBeInTheDocument();
    });
  });

  it('shows unresponsive supplier status', async () => {
    await goToProductIntelligence();
    await clickPiTab('Supplier Portal');
    await waitFor(() => {
      expect(screen.getByText('Unresponsive')).toBeInTheDocument();
    });
  });

  it('Invite Supplier button opens modal', async () => {
    await goToProductIntelligence();
    await clickPiTab('Supplier Portal');
    await waitFor(() => {
      expect(screen.getByText('+ Invite Supplier')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('+ Invite Supplier'));
    await waitFor(() => {
      expect(screen.getByText('Invite Supplier to Portal')).toBeInTheDocument();
    });
  });

  it('Supplier invite modal shows form fields and permissions', async () => {
    await goToProductIntelligence();
    await clickPiTab('Supplier Portal');
    fireEvent.click(screen.getByText('+ Invite Supplier'));
    await waitFor(() => {
      expect(screen.getByText('Supplier Name')).toBeInTheDocument();
      expect(screen.getByText('Contact Email')).toBeInTheDocument();
      expect(screen.getByText('Permissions')).toBeInTheDocument();
      expect(screen.getByText('Upload Products')).toBeInTheDocument();
    });
  });

  it('sending supplier invitation shows toast', async () => {
    await goToProductIntelligence();
    await clickPiTab('Supplier Portal');
    fireEvent.click(screen.getByText('+ Invite Supplier'));
    await waitFor(() => {
      expect(screen.getByText('Send Invitation →')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Send Invitation →'));
    await waitFor(() => {
      expect(screen.getByText(/Invitation email sent/)).toBeInTheDocument();
    });
  });

  it('closing supplier invite modal works', async () => {
    await goToProductIntelligence();
    await clickPiTab('Supplier Portal');
    fireEvent.click(screen.getByText('+ Invite Supplier'));
    await waitFor(() => {
      expect(screen.getByText('Invite Supplier to Portal')).toBeInTheDocument();
    });
    const cancelButtons = screen.getAllByText('Cancel');
    fireEvent.click(cancelButtons[cancelButtons.length - 1]);
    await waitFor(() => {
      expect(screen.queryByText('Invite Supplier to Portal')).not.toBeInTheDocument();
    });
  });

  it('Message button on supplier shows toast', async () => {
    await goToProductIntelligence();
    await clickPiTab('Supplier Portal');
    await waitFor(() => {
      const messageButtons = screen.getAllByText('Message');
      expect(messageButtons.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(messageButtons[0]);
    });
    await waitFor(() => {
      expect(screen.getByText(/Reminder email sent/)).toBeInTheDocument();
    });
  });
});

// ─────────────────────────────────────────────
//  PRODUCT INTELLIGENCE — TAB NAVIGATION & EDGE CASES
// ─────────────────────────────────────────────
describe('Product Intelligence — Navigation & Edge Cases', () => {
  it('navigates back to Home from Product Intelligence', async () => {
    await goToProductIntelligence();
    fireEvent.click(screen.getByText('← Back to Home'));
    await waitForScreen(/, Sarah 👋/);
  });

  it('navigates back via breadcrumb Home link', async () => {
    await goToProductIntelligence();
    fireEvent.click(screen.getByText('Home'));
    await waitForScreen(/, Sarah 👋/);
  });

  it('switches between all 5 tabs without errors', async () => {
    await goToProductIntelligence();

    await clickPiTab('AI Extraction');
    await waitFor(() => {
      expect(screen.getByText(/AI-Powered PDF Spec Extraction/)).toBeInTheDocument();
    });

    await clickPiTab('Cross-Reference');
    await waitFor(() => {
      expect(screen.getByText(/Competitive Equivalency Mapping/)).toBeInTheDocument();
    });

    await clickPiTab('Assemblies');
    await waitFor(() => {
      expect(screen.getByText('3 assemblies configured')).toBeInTheDocument();
    });

    await clickPiTab('Supplier Portal');
    await waitFor(() => {
      expect(screen.getByText(/Supplier Directory/)).toBeInTheDocument();
    });

    await clickPiTab('Launch Pipeline');
    await waitFor(() => {
      expect(screen.getByText(/Ready to Launch/)).toBeInTheDocument();
    });
  });

  it('navigates to Product Intelligence from Home Health KPI card', async () => {
    renderApp();
    fireEvent.click(screen.getByText('Product Launch'));
    await waitForScreen(/Ready to Launch/);
  });

  it('full journey: Home → Product → Extraction → Approve → Pipeline', async () => {
    await goToProductIntelligence();

    // Go to extraction
    await clickPiTab('AI Extraction');
    await waitFor(() => {
      expect(screen.getByText('Drop Supplier Spec Sheet Here')).toBeInTheDocument();
    });

    // Start extraction
    fireEvent.click(screen.getByText('Click to Upload & Extract (Demo)'));
    await waitFor(() => {
      expect(screen.getByText(/AI Extraction Review/)).toBeInTheDocument();
    });

    // Approve all
    fireEvent.click(screen.getByText(/Approve All/));
    await waitFor(() => {
      expect(screen.getByText(/products approved/)).toBeInTheDocument();
    });

    // Go back to pipeline
    await clickPiTab('Launch Pipeline');
    await waitFor(() => {
      expect(screen.getByText(/Ready to Launch/)).toBeInTheDocument();
    });
  });
});
