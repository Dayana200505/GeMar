import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import api from '../../services/api';

const HistoryView = () => {
  const [history, setHistory] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/api/water-readings');
      setHistory(response.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleViewDetails = async (monthYear) => {
    const [year, month] = monthYear.split('-');
    try {
      const response = await api.get(`/api/water-readings/${month}/${year}`);
      setSelectedData(response.data);
      setSelectedMonth(monthYear);
      setDialogOpen(true);
    } catch (err) {
      console.error('Error fetching month data:', err);
    }
  };

  const handleDownloadPDF = async (monthYear) => {
    const [year, month] = monthYear.split('-');
    try {
      const response = await api.get(`/api/generate-preaviso/${month}/${year}`);
      window.open(response.data.pdf_url, '_blank');
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  const formatMonthYear = (monthYear) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Historial de Lecturas
      </Typography>

      <Grid container spacing={3}>
        {Object.keys(history).map((monthYear) => (
          <Grid item xs={12} sm={6} md={4} key={monthYear}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    {formatMonthYear(monthYear)}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={`${history[monthYear].length} registros`}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewDetails(monthYear)}
                  >
                    <ViewIcon />
                  </IconButton>
                  
                  <IconButton
                    color="secondary"
                    onClick={() => handleDownloadPDF(monthYear)}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo para ver detalles */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Detalles para {selectedMonth && formatMonthYear(selectedMonth)}
        </DialogTitle>
        <DialogContent>
          {selectedData && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Resumen
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2">Consumo Total:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedData.total_consumption?.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2">Precio por Cubo:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedData.price_per_cube?.toFixed(4)} Bs.
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2">Total Bs.:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedData.total_amount?.toFixed(2)} Bs.
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2">Total Redondeado:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedData.departments?.reduce((sum, d) => sum + d.rounded_amount, 0).toFixed(2)} Bs.
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Detalles por Departamento
              </Typography>
              {/* Aquí puedes agregar una tabla detallada similar a la del formulario */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
          <Button
            variant="contained"
            onClick={() => selectedMonth && handleDownloadPDF(selectedMonth)}
          >
            Descargar PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HistoryView;