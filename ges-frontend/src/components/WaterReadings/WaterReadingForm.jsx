import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Card,
  CardContent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../services/api';

const WaterReadingForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [date, setDate] = useState(new Date());
  const [semapaReadings, setSemapaReadings] = useState(['', '']);
  const [readings, setReadings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [previousMonthData, setPreviousMonthData] = useState(null);

  useEffect(() => {
    fetchDepartments();
    checkExistingRecord();
  }, [date]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/api/departments');
      const depts = response.data;
      setDepartments(depts);
      
      // Inicializar lecturas
      const initialReadings = depts.map(dept => ({
        department_id: dept.id,
        department_code: dept.code,
        current_reading: '',
        previous_reading: 0,
        consumption: 0,
        total_amount: 0,
        rounded_amount: 0
      }));
      setReadings(initialReadings);
      
      // Cargar datos del mes anterior
      const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      loadPreviousMonthData(prevMonth);
      
    } catch (err) {
      setError('Error al cargar departamentos');
    }
  };

  const loadPreviousMonthData = async (prevMonth) => {
    try {
      const response = await api.get(`/api/water-readings/${prevMonth.getMonth() + 1}/${prevMonth.getFullYear()}`);
      if (response.data.departments) {
        setPreviousMonthData(response.data.departments);
        
        // Actualizar previous_reading en readings
        setReadings(prev => prev.map(reading => {
          const prevReading = response.data.departments.find(
            d => d.department_id === reading.department_id
          );
          return {
            ...reading,
            previous_reading: prevReading ? prevReading.current_reading : 0
          };
        }));
      }
    } catch (err) {
      // No hay datos del mes anterior, continuar normalmente
    }
  };

  const checkExistingRecord = async () => {
    try {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const response = await api.get(`/api/water-readings/${month}/${year}`);
      if (response.data.departments && response.data.departments.length > 0) {
        setError('Ya existe un registro para este mes. Use la vista de historial para verlo.');
      }
    } catch (err) {
      // No existe registro, continuar
    }
  };

  const handleSemapaChange = (index, value) => {
    const newSemapaReadings = [...semapaReadings];
    newSemapaReadings[index] = value;
    setSemapaReadings(newSemapaReadings);
  };

  const handleReadingChange = (index, field, value) => {
    const newReadings = [...readings];
    newReadings[index] = {
      ...newReadings[index],
      [field]: parseFloat(value) || 0
    };
    setReadings(newReadings);
  };

  const calculateTotals = () => {
    // Calcular consumo total de departamentos (excluyendo GENERAL)
    const departmentsWithoutGeneral = readings.filter(r => r.department_code !== 'GENERAL');
    const totalConsumption = departmentsWithoutGeneral.reduce((sum, reading) => {
      const consumption = reading.current_reading - reading.previous_reading;
      return sum + (consumption > 0 ? consumption : 0);
    }, 0);

    // Calcular total SEMAPA
    const semapaTotal = semapaReadings.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    // Calcular precio por cubo
    const pricePerCube = totalConsumption > 0 ? semapaTotal / totalConsumption : 0;

    // Actualizar lecturas con cálculos
    const updatedReadings = readings.map(reading => {
      const consumption = reading.current_reading - reading.previous_reading;
      const totalAmount = consumption * pricePerCube;
      const roundedAmount = Math.round(totalAmount);
      
      return {
        ...reading,
        consumption: consumption > 0 ? consumption : 0,
        total_amount: totalAmount,
        rounded_amount: roundedAmount
      };
    });

    setReadings(updatedReadings);

    return {
      totalConsumption,
      semapaTotal,
      pricePerCube,
      totalAmount: updatedReadings.reduce((sum, r) => sum + r.total_amount, 0),
      totalRounded: updatedReadings.reduce((sum, r) => sum + r.rounded_amount, 0)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const totals = calculateTotals();
      
      const data = {
        reading_date: date.toISOString().split('T')[0],
        semapa_readings: semapaReadings.map(v => parseFloat(v) || 0),
        readings: readings.map(r => ({
          department_id: r.department_id,
          current_reading: parseFloat(r.current_reading) || 0
        }))
      };

      const response = await api.post('/api/water-readings', data);
      setSuccess('Lecturas guardadas exitosamente');
      
      // Generar PDF automáticamente
      await generatePDF();
      
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar lecturas');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    try {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const response = await api.get(`/api/generate-preaviso/${month}/${year}`);
      
      // Descargar PDF
      window.open(response.data.pdf_url, '_blank');
      
    } catch (err) {
      console.error('Error al generar PDF:', err);
    }
  };

  const totals = calculateTotals();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Registro de Lecturas de Agua
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Fecha de Lectura"
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  views={['year', 'month']}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">
                  Mes: {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Lecturas SEMAPA */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lecturas SEMAPA
              </Typography>
              <Grid container spacing={2}>
                {semapaReadings.map((reading, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <TextField
                      fullWidth
                      label={`Lectura SEMAPA ${index + 1}`}
                      type="number"
                      value={reading}
                      onChange={(e) => handleSemapaChange(index, e.target.value)}
                      InputProps={{ inputProps: { step: '0.01' } }}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Total SEMAPA: {totals.semapaTotal.toFixed(2)} Bs.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Tabla de lecturas */}
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Departamento</TableCell>
                  <TableCell align="right">Lectura Anterior</TableCell>
                  <TableCell align="right">Lectura Actual</TableCell>
                  <TableCell align="right">Consumo</TableCell>
                  <TableCell align="right">Total (Bs.)</TableCell>
                  <TableCell align="right">Redondeado (Bs.)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {readings.map((reading, index) => (
                  <TableRow key={reading.department_id}>
                    <TableCell>{reading.department_code}</TableCell>
                    <TableCell align="right">
                      {reading.previous_reading.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        size="small"
                        type="number"
                        value={reading.current_reading}
                        onChange={(e) => handleReadingChange(index, 'current_reading', e.target.value)}
                        disabled={reading.department_code === 'GENERAL'}
                        InputProps={{ inputProps: { step: '0.01' } }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {reading.consumption.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {reading.total_amount.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {reading.rounded_amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totales */}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="h6">TOTALES:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">
                      {totals.totalConsumption.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">
                      {totals.totalAmount.toFixed(2)} Bs.
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">
                      {totals.totalRounded.toFixed(2)} Bs.
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Precio por cubo */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body1">
                    Consumo Total: {totals.totalConsumption.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body1">
                    Total SEMAPA: {totals.semapaTotal.toFixed(2)} Bs.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6">
                    Precio por Cubo: {totals.pricePerCube.toFixed(4)} Bs.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Botones */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={calculateTotals}
            >
              Calcular
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Guardar y Generar Preaviso'}
            </Button>
          </Box>
        </Paper>

        {/* Notificaciones */}
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Snackbar>
        <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
          <Alert severity="success" onClose={() => setSuccess('')}>
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default WaterReadingForm;