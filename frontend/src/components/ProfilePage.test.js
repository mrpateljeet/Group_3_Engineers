import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from './ProfilePage';

const mockNavigate = jest.fn();
const mockFetch = jest.fn();
const mockSetItem = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

global.fetch = mockFetch;
Storage.prototype.setItem = mockSetItem;

beforeEach(() => {
    jest.clearAllMocks();
});

test('renders profile page with user data', async () => {
    mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
            name: 'John Doe',
            email: 'john.doe@example.com',
            job: 'Developer',
            bio: 'Bio',
            age: 30,
            salary: 5000,
            accountBalance: 2000
        }),
    });

    render(
        <BrowserRouter>
            <Profile />
        </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
        expect(screen.getByText('Name:')).toBeInTheDocument();
    });
    
    await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    await waitFor(() => {
        expect(screen.getByText('Email:')).toBeInTheDocument();
    });
    
    await waitFor(() => {
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });
});

test('shows error message if profile fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.reject(new Error('Failed to fetch user profile')),
    });

    render(
        <BrowserRouter>
            <Profile />
        </BrowserRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Failed to fetch user profile')).toBeInTheDocument();
    });
});
