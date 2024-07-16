import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
    return (
        <TableContainer component={Paper} className="transaction-table-container">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className="table-header">Amount</TableCell>
                        <TableCell className="table-header">Date</TableCell>
                        <TableCell className="table-header">Description</TableCell>
                        <TableCell className="table-header">Category</TableCell>
                        <TableCell className="table-header">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction._id} className="table-row">
                            <TableCell className="table-cell">{transaction.amount}</TableCell>
                            <TableCell className="table-cell">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell className="table-cell">{transaction.description}</TableCell>
                            <TableCell className="table-cell">{transaction.categoryId.name}</TableCell>
                            <TableCell className="table-cell">
                                <IconButton color="primary" onClick={() => onEdit(transaction)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="secondary" onClick={() => onDelete(transaction._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TransactionList;