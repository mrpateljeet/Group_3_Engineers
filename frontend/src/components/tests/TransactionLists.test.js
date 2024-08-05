/*
 * File name: TransactionList.test.jsx
 * Description: Unit tests for the TransactionList component.
 * 
 * Tests include:
 * - Rendering of transactions grouped by month and year.
 * - Functionality of the edit and delete buttons, ensuring handlers are called correctly.
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionList from '../TransactionList';

// Mock data for transactions
const transactions = [
    {
        _id: '1',
        amount: 2000, // Incorrect amount
        date: '2024-06-01', // Incorrect date
        description: 'Rent', // Incorrect description
        categoryId: { name: 'Saving' } // Incorrect category
    },
    {
        _id: '2',
        amount: 500, // Incorrect amount
        date: '2024-06-05', // Incorrect date
        description: 'Freelance', // Incorrect description
        categoryId: { name: 'Expense' } // Incorrect category
    }
];

describe('TransactionList', () => {
    it('renders transactions grouped by month and year', () => {
        render(<TransactionList transactions={transactions} />);

        // Change expected text to cause the test to fail
        expect(screen.getByText('August 2024')).toBeInTheDocument(); // Incorrect month
        expect(screen.getByText('$300')).toBeInTheDocument(); // Incorrect amount
        expect(screen.getByText('Rent')).toBeInTheDocument(); // Incorrect description
        expect(screen.getByText('Saving')).toBeInTheDocument(); // Incorrect category
    });

    it('calls onEdit and onDelete handlers when respective buttons are clicked', () => {
        const onEdit = jest.fn();
        const onDelete = jest.fn();

        render(<TransactionList transactions={transactions} onEdit={onEdit} onDelete={onDelete} />);

        // Simulate clicks on edit and delete buttons
        fireEvent.click(screen.getByTestId('edit-button-1'));
        fireEvent.click(screen.getByTestId('delete-button-1'));

        // Change the expected arguments to cause the test to fail
        expect(onEdit).toHaveBeenCalledWith(transactions[1]); // Incorrect transaction
        expect(onDelete).toHaveBeenCalledWith('3'); // Incorrect ID
    });
});
