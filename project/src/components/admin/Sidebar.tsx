import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Dashboard as DashboardIcon,
  Business as ProjectsIcon,
  BrandingWatermark as BrandsIcon,
  Info as AboutIcon,
  Image as HeroIcon,
  People as BoardIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Board Members', icon: <BoardIcon />, path: '/admin/board' },
  { text: 'Projects', icon: <ProjectsIcon />, path: '/admin/projects' },
  { text: 'Brands', icon: <BrandsIcon />, path: '/admin/brands' },
  { text: 'About', icon: <AboutIcon />, path: '/admin/about' },
  { text: 'Hero Section', icon: <HeroIcon />, path: '/admin/hero' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', mt: 2 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          Admin Panel
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => isMobile && setMobileOpen(false)} // close drawer on click (mobile)
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* AppBar with Hamburger */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Temporary on mobile */}
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true, // better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#f8f9fa',
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              mt: isMobile ? 0 : 8,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
};

export default Sidebar;
