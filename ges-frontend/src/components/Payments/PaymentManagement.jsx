import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../services/api';

const PaymentManagement = () => {
  const [date, setDate] = useState(new Date());
  const [payments, setPayments] = useState([]);
  const [expensesAmount, setExpensesAmount] = useState(250);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [date]);

  const fetchPayments = async () => {
    try {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const response = await api.get(`/api/payments/${month}/${year}`);
      setPayments(response.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  const handleCreatePayments = async () => {
    setLoading(true);
    try {
      await api.post('/api/create-payments', {
        month: date.toISOString().split('T')[0],
        expenses_amount: expensesAmount
      });
      fetchPayments();
    } catch (err) {
      console.error('Error creating payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePayment = async (paymentId, status, paidAmount = null) => {
    try {
      await api.put(`/api/payments/${paymentId}`, {
        status,
        paid_amount: paidAmount,
        payment_date: status === 'paid' ? new Date().toISOString().split('T')[0] : null
      });
      fetchPayments();
    } catch (err) {
      console.error('Error updating payment:', err);
    }
  };

  const calculateTotals = () => {
    const totalExpenses = payments.reduce((sum, p) => sum + p.expenses_amount, 0);
    const totalWater = payments.reduce((sum, p) => sum + p.water_amount, 0);
    const totalAmount = payments.reduce((sum, p) => sum + p.total_amount, 0);
    const totalPaid = payments.reduce((sum, p) => 
      sum + (p.status === 'paid' ? p.paid_amount || p.total_amount : 0), 0);
    const pendingAmount = totalAmount - totalPaid;

    return {
      totalExpenses,
      totalWater,
      totalAmount,
      totalPaid,
      pendingAmount
    };
  };

  const totals = calculateTotals();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Gestión de Pagos
          </Typography>

          {/* Controles */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <DatePicker
                    label="Mes de Gestión"
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    views={['year', 'month']}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Monto de Expensas"
                    type="number"
                    value={expensesAmount}
                    onChange={(e) => setExpensesAmount(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    onClick={handleCreatePayments}
                    disabled={loading}
                    fullWidth
                  >
                    Crear Registros de Pago
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Tabla de pagos */}
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Departamento</TableCell>
                  <TableCell align="right">Expensas (Bs.)</TableCell>
                  <TableCell align="right">Agua (Bs.)</TableCell>
                  <TableCell align="right">Total (Bs.)</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                  <TableCell align="right">Monto Pagado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.department?.code}</TableCell>
                    <TableCell align="right">
                      {payment.expenses_amount?.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {payment.water_amount?.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {payment.total_amount?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payment.status === 'paid' ? 'Pagado' : 'Pendiente'}
                        color={payment.status === 'paid' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {payment.status === 'pending' && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleUpdatePayment(payment.id, 'paid')}
                        >
                          Marcar como Pagado
                        </Button>
                      )}
                      {payment.status === 'paid' && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleUpdatePayment(payment.id, 'pending')}
                        >
                          Revertir
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {payment.status === 'paid' ? (
                        payment.paid_amount ? 
                          payment.paid_amount.toFixed(2) :
                          payment.total_amount.toFixed(2)
                      ) : '0.00'}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totales */}
                <TableRow>
                  <TableCell colSpan={2} align="right">
                    <Typography variant="h6">TOTALES:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">
                      {totals.totalWater.toFixed(2)} Bs.
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">
                      {totals.totalAmount.toFixed(2)} Bs.
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={2}>
                    <Chip
                      label={`Pagado: ${totals.totalPaid.toFixed(2)} Bs.`}
                      color="success"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" color="error">
                      Pendiente: {totals.pendingAmount.toFixed(2)} Bs.
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Resumen */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Totales del Mes
                  </Typography>
                  <Typography variant="body1">
                    Expensas: {totals.totalExpenses.toFixed(2)} Bs.
                  </Typography>
                  <Typography variant="body1">
                    Agua: {totals.totalWater.toFixed(2)} Bs.
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    Total: {totals.totalAmount.toFixed(2)} Bs.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Estado de Pagos
                  </Typography>
                  <Typography variant="body1" color="success.main">
                    Pagado: {totals.totalPaid.toFixed(2)} Bs.
                  </Typography>
                  <Typography variant="body1" color="warning.main">
                    Pendiente: {totals.pendingAmount.toFixed(2)} Bs.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default PaymentManagement;