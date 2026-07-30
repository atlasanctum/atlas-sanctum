import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import RecurringSubscriptions from '../RecurringSubscriptions';

// ── Supabase mock ────────────────────────────────────────────────────────────
// A single controllable update() outcome + a fixed select() dataset.
const state = {
  updateError: null as null | { message: string },
  rows: [
    {
      id: 'sub-1',
      plan_name: 'Forest Guardians',
      amount: 25,
      currency: 'USD',
      billing_period: 'monthly',
      status: 'active',
      current_period_end: new Date(Date.now() + 86_400_000 * 30).toISOString(),
      canceled_at: null,
      metadata: null,
    },
  ],
};

vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          in: () => ({
            order: async () => ({ data: state.rows, error: null }),
          }),
        }),
      }),
      update: () => ({
        eq: async () => ({ error: state.updateError }),
      }),
    }),
  },
}));

import { toast } from 'sonner';

const clickConfirm = async (label: RegExp) => {
  const dialog = await screen.findByRole('alertdialog');
  fireEvent.click(within(dialog).getByRole('button', { name: label }));
};

describe('RecurringSubscriptions — optimistic rollback', () => {
  beforeEach(() => {
    state.updateError = null;
    vi.clearAllMocks();
  });

  it('rolls back Cancel on Supabase failure and shows inline error', async () => {
    state.updateError = { message: 'Network down' };
    render(<RecurringSubscriptions userId="u1" />);

    await screen.findByText('Forest Guardians');
    fireEvent.click(screen.getByRole('button', { name: /^Cancel$/ }));
    await clickConfirm(/Yes, cancel/i);

    await waitFor(() => expect(screen.getByText(/Network down/i)).toBeInTheDocument());
    // Status badge should NOT flip to "canceled" after rollback.
    expect(screen.getAllByText(/active/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/^canceled$/i)).toBeNull();
    expect(toast.error).toHaveBeenCalledWith(expect.stringMatching(/Network down/));
  });

  it('rolls back Pause on failure', async () => {
    state.updateError = { message: 'Pause failed' };
    render(<RecurringSubscriptions userId="u1" />);

    await screen.findByText('Forest Guardians');
    fireEvent.click(screen.getByRole('button', { name: /Pause/i }));
    await clickConfirm(/^Pause$/);

    await waitFor(() => expect(screen.getByText(/Pause failed/i)).toBeInTheDocument());
    expect(screen.queryByText(/^paused$/i)).toBeNull();
  });

  it('rolls back Edit amount on failure and keeps original value', async () => {
    state.updateError = { message: 'Update rejected' };
    render(<RecurringSubscriptions userId="u1" />);

    await screen.findByText('Forest Guardians');
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

    const dialog = await screen.findByRole('dialog');
    const input = within(dialog).getByDisplayValue('25') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.click(within(dialog).getByRole('button', { name: /^Save$/ }));

    await waitFor(() => expect(screen.getByText(/Update rejected/i)).toBeInTheDocument());
    // Optimistic $99 should have rolled back to original $25.
    expect(screen.getByText(/\$25/)).toBeInTheDocument();
    expect(screen.queryByText(/\$99/)).toBeNull();
  });

  it('applies Resume optimistically and keeps it on success', async () => {
    state.rows = [{ ...state.rows[0], status: 'paused' }];
    state.updateError = null;
    render(<RecurringSubscriptions userId="u1" />);

    await screen.findByText('Forest Guardians');
    fireEvent.click(screen.getByRole('button', { name: /Resume/i }));
    await clickConfirm(/^Resume$/);

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(expect.stringMatching(/resumed/i)));
    expect(screen.queryByText(/Pause failed/i)).toBeNull();

    // Restore default row for next tests
    state.rows = [{ ...state.rows[0], status: 'active' }];
  });
});