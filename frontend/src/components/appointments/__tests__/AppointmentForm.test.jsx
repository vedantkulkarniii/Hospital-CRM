import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppointmentFormModal from '../AppointmentFormModal';

vi.mock('../../../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('../../common/Modal', () => ({
  default: ({ isOpen, children, onClose }) => isOpen ? <div data-testid="modal">{children}</div> : null,
}));

vi.mock('../../common/Alert', () => ({
  default: ({ message, type }) => (
    <div data-testid={`alert-${type}`} role="alert">
      {message}
    </div>
  ),
}));

const mockPatients = [
  { _id: '1', firstName: 'John', lastName: 'Doe' },
  { _id: '2', firstName: 'Jane', lastName: 'Smith' },
];

const mockDoctors = [
  { _id: 'doc1', firstName: 'Dr', lastName: 'Smith', specialization: 'Cardiology' },
  { _id: 'doc2', firstName: 'Dr', lastName: 'Johnson', specialization: 'Neurology' },
];

describe('AppointmentFormModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderAppointmentForm = (props = {}) => {
    const defaultProps = {
      isOpen: true,
      onClose: mockOnClose,
      onSubmit: mockOnSubmit,
      appointment: null,
      isLoading: false,
      error: null,
      currentUser: { _id: 'user1', role: 'admin' },
      ...props,
    };

    return render(<AppointmentFormModal {...defaultProps} />);
  };

  it('should render modal when isOpen is true', () => {
    renderAppointmentForm();

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('should not render modal when isOpen is false', () => {
    const { queryByTestId } = render(
      <AppointmentFormModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should have appointment type select', () => {
    renderAppointmentForm();

    const typeSelect = screen.getByLabelText(/appointment type/i);
    expect(typeSelect).toBeInTheDocument();
  });

  it('should have reason field', () => {
    renderAppointmentForm();

    const reasonInput = screen.getByPlaceholderText(/reason/i);
    expect(reasonInput).toBeInTheDocument();
  });

  it('should have notes field', () => {
    renderAppointmentForm();

    const notesInput = screen.queryByPlaceholderText(/notes/i);
    expect(notesInput).toBeInTheDocument();
  });

  it('should have appointment date field', () => {
    renderAppointmentForm();

    const dateInput = screen.getByLabelText(/appointment date/i);
    expect(dateInput).toBeInTheDocument();
  });

  it('should have start time field', () => {
    renderAppointmentForm();

    const startTimeInput = screen.getByLabelText(/start time/i);
    expect(startTimeInput).toBeInTheDocument();
  });

  it('should have end time field', () => {
    renderAppointmentForm();

    const endTimeInput = screen.getByLabelText(/end time/i);
    expect(endTimeInput).toBeInTheDocument();
  });

  it('should have submit button', () => {
    renderAppointmentForm();

    const submitButton = screen.getByRole('button', { name: /book appointment|update appointment/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should disable submit button when loading', () => {
    renderAppointmentForm({ isLoading: true });

    const submitButton = screen.getByRole('button', { name: /booking|updating/i });
    expect(submitButton).toBeDisabled();
  });

  it('should display error message when provided', () => {
    const errorMsg = 'Appointment slot already booked';
    renderAppointmentForm({ error: errorMsg });

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('should have cancel button', () => {
    renderAppointmentForm();

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();
  });

  it('should call onClose when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderAppointmentForm();

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should populate form with appointment data when editing', () => {
    const appointment = {
      _id: 'apt1',
      patient: { _id: '1', firstName: 'John' },
      doctor: { _id: 'doc1', firstName: 'Dr' },
      appointmentDate: '2024-12-25T00:00:00Z',
      startTime: '10:00',
      endTime: '11:00',
      type: 'follow-up',
      reason: 'Follow-up checkup',
      notes: 'Please arrive early',
    };

    renderAppointmentForm({ appointment });

    expect(screen.getByDisplayValue('follow-up')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Follow-up checkup')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Please arrive early')).toBeInTheDocument();
  });

  it('should render with consultation type by default', () => {
    renderAppointmentForm();

    const typeSelect = screen.getByDisplayValue('consultation');
    expect(typeSelect).toBeInTheDocument();
  });

  it('should have all appointment types in dropdown', () => {
    renderAppointmentForm();

    const typeSelect = screen.getByLabelText(/appointment type/i);
    const options = typeSelect.querySelectorAll('option');

    const types = Array.from(options).map(opt => opt.value);
    expect(types).toContain('consultation');
    expect(types).toContain('follow-up');
    expect(types).toContain('checkup');
  });

  it('should update form fields on user input', async () => {
    const user = userEvent.setup();
    renderAppointmentForm();

    const reasonInput = screen.getByPlaceholderText(/reason/i);
    await user.type(reasonInput, 'Annual checkup');

    expect(reasonInput).toHaveValue('Annual checkup');
  });
});
