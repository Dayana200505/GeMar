import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button
} from '@mui/material';
import {
  WaterDrop as WaterIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  CalendarMonth as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    currentMonth: {
      totalConsumption: 0,
      totalAmount: 0,
      pricePerCube: 0,
      departmentCount: 0
    },
    payments: {
      pending: 0,
      paid: 0,
      total: 0
    },
    recentExpenses: [],
    recentReadings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      // Obtener lecturas del mes actual
      const readingsResponse = await api.get(`/api/water-readings/${month}/${year}`);
      const readingsData = readingsResponse.data;

      // Obtener pagos del mes actual
      const paymentsResponse = await api.get(`/api/payments/${month}/${year}`);
      const paymentsData = paymentsResponse.data;

      // Obtener gastos recientes
      const expensesResponse = await api.get('/api/expenses');
      const expensesData = expensesResponse.data;

      setStats({
        currentMonth: {
          totalConsumption: readingsData.total_consumption || 0,
          totalAmount: readingsData.total_amount || 0,
          pricePerCube: readingsData.price_per_cube || 0,
          departmentCount: readingsData.departments?.length || 0
        },
        payments: {
          pending: paymentsData.filter(p => p.status === 'pending').length,
          paid: paymentsData.filter(p => p.status === 'paid').length,
          total: paymentsData.length
        },
        recentExpenses: expensesData.slice(0, 5),
        recentReadings: readingsData.departments?.slice(0, 5) || []
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: 1,
              p: 1,
              mr: 2
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography color="textSecondary" variant="body2">
              {title}
            </Typography>
            <Typography variant="h5">
              {typeof value === 'number' ? value.toFixed(2) : value}
              {subtitle && (
                <Typography component="span" variant="body2" color="textSecondary">
                  {' '}{subtitle}
                </Typography>
              )}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard - Edificio Mar del Plata
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Sistema de Gestión Integral
      </Typography>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Consumo Total"
            value={stats.currentMonth.totalConsumption}
            subtitle="cubos"
            icon={<WaterIcon sx={{ color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monto Total"
            value={stats.currentMonth.totalAmount}
            subtitle="Bs."
            icon={<MoneyIcon sx={{ color: 'success.main' }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Precio por Cubo"
            value={stats.currentMonth.pricePerCube}
            subtitle="Bs."
            icon={<TrendingUpIcon sx={{ color: 'info.main' }} />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pagos Pendientes"
            value={`${stats.payments.pending}/${stats.payments.total}`}
            icon={<PaymentIcon sx={{ color: 'warning.main' }} />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Botones de acción rápida */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Button
            component={Link}
            to="/water-readings"
            variant="contained"
            fullWidth
            startIcon={<WaterIcon />}
          >
            Nueva Lectura
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button
            component={Link}
            to="/payments"
            variant="contained"
            color="secondary"
            fullWidth
            startIcon={<PaymentIcon />}
          >
            Ver Pagos
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button
            component={Link}
            to="/expenses"
            variant="contained"
            color="success"
            fullWidth
            startIcon={<ReceiptIcon />}
          >
            Gastos
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button
            component={Link}
            to="/history"
            variant="outlined"
            fullWidth
            startIcon={<CalendarIcon />}
          >
            Historial
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Lecturas recientes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lecturas Recientes
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Departamento</TableCell>
                    <TableCell align="right">Consumo</TableCell>
                    <TableCell align="right">Total (Bs.)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentReadings.map((reading) => (
                    <TableRow key={reading.department_id}>
                      <TableCell>{reading.department?.code}</TableCell>
                      <TableCell align="right">
                        {reading.consumption?.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {reading.rounded_amount?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                component={Link}
                to="/history"
                size="small"
              >
                Ver todo el historial
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Gastos recientes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Gastos Recientes
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell align="right">Monto (Bs.)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell align="right">
                        {parseFloat(expense.amount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                component={Link}
                to="/expenses"
                size="small"
              >
                Ver todos los gastos
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Estado de pagos */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Estado de Pagos del Mes
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ mr: 2, minWidth: 100 }}>
                Pendientes:
              </Typography>
              <Chip
                label={`${stats.payments.pending} departamentos`}
                color="warning"
                size="small"
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2, minWidth: 100 }}>
                Pagados:
              </Typography>
              <Chip
                label={`${stats.payments.paid} departamentos`}
                color="success"
                size="small"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              component={Link}
              to="/payments"
              variant="contained"
              fullWidth
              startIcon={<PaymentIcon />}
            >
              Gestionar Pagos
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;