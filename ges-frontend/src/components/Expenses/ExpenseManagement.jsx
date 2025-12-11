import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import api from '../../services/api';

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    invoice_number: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/api/expenses');
      setExpenses(response.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.description || !newExpense.amount) {
      alert('Por favor complete la descripción y el monto');
      return;
    }

    try {
      await api.post('/api/expenses', newExpense);
      setNewExpense({
        description: '',
        invoice_number: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchExpenses();
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este gasto?')) {
      try {
        await api.delete(`/api/expenses/${id}`);
        fetchExpenses();
      } catch (err) {
        console.error('Error deleting expense:', err);
      }
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gestión de Gastos del Edificio
        </Typography>

        {/* Formulario para agregar gastos */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="N° Factura"
                  value={newExpense.invoice_number}
                  onChange={(e) => setNewExpense({...newExpense, invoice_number: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Monto (Bs.)"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddExpense}
                  fullWidth
                >
                  Agregar Gasto
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabla de gastos */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>N° Factura</TableCell>
                <TableCell align="right">Monto (Bs.)</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.invoice_number}</TableCell>
                  <TableCell align="right">
                    {parseFloat(expense.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {/* Total */}
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Typography variant="h6">TOTAL GASTOS:</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">
                    {totalExpenses.toFixed(2)} Bs.
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default ExpenseManagement;