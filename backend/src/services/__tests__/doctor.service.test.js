const doctorService = require('../doctor.service');
const Doctor = require('../../models/Doctor');

jest.mock('../../models/Doctor', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('doctorService.createDoctor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws a conflict error when a doctor with the same email already exists', async () => {
    Doctor.findOne.mockResolvedValueOnce({ _id: 'existing-doctor' });

    await expect(
      doctorService.createDoctor(
        {
          firstName: 'Jane',
          lastName: 'Doe',
          specialization: 'Cardiology',
          phone: '9876543210',
          email: 'jane@example.com',
        },
        'user-123',
      ),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: 'A doctor with this email already exists.',
    });

    expect(Doctor.findOne).toHaveBeenCalled();
    expect(Doctor.create).not.toHaveBeenCalled();
  });
});
