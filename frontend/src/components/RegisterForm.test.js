import React from 'react';
import { render, screen, fireEvent, waitFor  } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterForm from './RegisterForm';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));
beforeAll(() => {
    // Mock localStorage methods
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
});
test('renders register form', () => {
    render(
        <BrowserRouter>
            <RegisterForm />
        </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'Budget Minder', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Register', level: 2 })).toBeInTheDocument();
    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
});
test('validates email format', async () => {
    render(
        <BrowserRouter>
            <RegisterForm />
        </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText('Username:');
    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Password:');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(screen.getByText('Invalid email format.')).toBeInTheDocument();
    });
});
test('submits form with valid data', async () => {
    jest.setTimeout(10000); 
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ token: 'fake-token', message: 'Registration successful' }),
        })
    );

    render(
        <BrowserRouter>
            <RegisterForm />
        </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText('Username:');
    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Password:');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(screen.getByText('Registration successful')).toBeInTheDocument();
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
    expect(mockNavigate).toHaveBeenCalledWith('/complete-profile');
});