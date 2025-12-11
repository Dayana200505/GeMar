import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  IconButton
} from '@mui/material';
import {
  Menu as MenuIcon,
  WaterDrop as WaterIcon,
  History as HistoryIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Home as HomeIcon
} from '@mui/icons-material';

// Componentes
import WaterReadingForm from './components/WaterReadings/WaterReadingForm';
import HistoryView from './components/History/HistoryView';
import PaymentManagement from './components/Payments/PaymentManagement';
import ExpenseManagement from './components/Expenses/ExpenseManagement';
import Dashboard from './components/Dashboard/Dashboard';

const drawerWidth = 240;

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Registro de Lecturas', icon: <WaterIcon />, path: '/water-readings' },
    { text: 'Historial', icon: <HistoryIcon />, path: '/history' },
    { text: 'Gestión de Pagos', icon: <PaymentIcon />, path: '/payments' },
    { text: 'Gastos del Edificio', icon: <ReceiptIcon />, path: '/expenses' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Mar del Plata
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Sistema de Gestión - Edificio Mar del Plata
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Container maxWidth="lg">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/water-readings" element={<WaterReadingForm />} />
              <Route path="/history" element={<HistoryView />} />
              <Route path="/payments" element={<PaymentManagement />} />
              <Route path="/expenses" element={<ExpenseManagement />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

export default App;