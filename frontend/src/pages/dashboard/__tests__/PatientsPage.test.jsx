import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import PatientsPage from '../PatientsPage';
import patientReducer from '../../../store/slices/patientSlice';
import authReducer from '../../../store/slices/authSlice';
import * as patientService from '../../../services/patientService';

vi.mock('../../../services/patientService');
vi.mock('../../../components/patients/PatientFormModal', () => ({
  default: () => <div data-testid="patient-form-modal">Patient Form Modal</div>,
}));
vi.mock('../../../components/patients/PatientDetailModal', () => ({
  default: () => <div data-testid="patient-detail-modal">Patient Detail Modal</div>,
}));
vi.mock('../../../components/common/Alert', () => ({
  default: ({ message, type }) => (
    <div data-testid={`alert-${type}`} role="alert">
      {message}
    </div>
  ),
}));

const mockPatients = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '9876543210',
    gender: 'male',
    bloodGroup: 'O+',
  },
  {
    _id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '9876543211',
    gender: 'female',
    bloodGroup: 'A+',
  },
];

const mockStore = configureStore({
  reducer: {
    patients: patientReducer,
    auth: authReducer,
  },
  preloadedState: {
    auth: {
      currentUser: { _id: 'admin-1', role: 'admin' },
      isAuthenticated: true,
    },
    patients: {
      list: mockPatients,
      selectedPatient: null,
      loading: false,
      error: null,
      pagination: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    },
  },
});

const renderPatientsPage = () => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <PatientsPage />
      </BrowserRouter>
    </Provider>
  );
};

describe('PatientsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    patientService.default = patientService;
    patientService.getPatients = vi.fn().mockResolvedValue({
      data: mockPatients,
      meta: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });

  it('should render patients page with table', async () => {
    renderPatientsPage();

    await waitFor(() => {
      expect(screen.getByText(/patients management/i)).toBeInTheDocument();
    });
  });

  it('should display list of patients', async () => {
    renderPatientsPage();

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });
  });

  it('should display patient details in table', async () => {
    renderPatientsPage();

    await waitFor(() => {
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('O+')).toBeInTheDocument();
      expect(screen.getByText('A+')).toBeInTheDocument();
    });
  });

  it('should have add patient button', async () => {
    renderPatientsPage();

    const addButton = screen.getByRole('button', { name: /add patient/i });
    expect(addButton).toBeInTheDocument();
  });

  it('should have search functionality', async () => {
    renderPatientsPage();

    const searchInput = screen.getByPlaceholderText(/search by name or email/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should have gender filter', async () => {
    renderPatientsPage();

    const genderFilter = screen.getByDisplayValue('');
    expect(genderFilter).toBeInTheDocument();
  });

  it('should have blood group filter', async () => {
    renderPatientsPage();

    const bloodGroupSelects = screen.getAllByDisplayValue('');
    expect(bloodGroupSelects.length).toBeGreaterThan(0);
  });

  it('should have view action buttons for each patient', async () => {
    renderPatientsPage();

    await waitFor(() => {
      const viewButtons = screen.getAllByRole('button', { name: /view/i });
      expect(viewButtons.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should have edit action buttons for each patient', async () => {
    renderPatientsPage();

    await waitFor(() => {
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      expect(editButtons.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should have delete action buttons for each patient', async () => {
    renderPatientsPage();

    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      expect(deleteButtons.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should display patient form modal when add patient is clicked', async () => {
    renderPatientsPage();

    const addButton = screen.getByRole('button', { name: /add patient/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('patient-form-modal')).toBeInTheDocument();
    });
  });

  it('should display patient detail modal when view button is clicked', async () => {
    renderPatientsPage();

    await waitFor(() => {
      const viewButtons = screen.getAllByRole('button', { name: /view/i });
      fireEvent.click(viewButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByTestId('patient-detail-modal')).toBeInTheDocument();
    });
  });

  it('should display pagination controls', async () => {
    renderPatientsPage();

    await waitFor(() => {
      const paginationText = screen.getByText(/page/i);
      expect(paginationText).toBeInTheDocument();
    });
  });

  it('should display error message when fetch fails', async () => {
    patientService.getPatients = vi.fn().mockRejectedValue(
      new Error('Failed to fetch patients')
    );

    renderPatientsPage();

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch patients/i)).toBeInTheDocument();
    });
  });

  it('should display loading state', async () => {
    patientService.getPatients = vi.fn(() => new Promise(() => {})); // Never resolves

    renderPatientsPage();

    await waitFor(() => {
      expect(screen.getByTestId(/loading/i)).toBeInTheDocument();
    });
  });
});
