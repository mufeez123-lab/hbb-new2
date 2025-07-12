import React from 'react';
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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Business as ProjectsIcon,
  BrandingWatermark as BrandsIcon,
  Info as AboutIcon,
  Image as HeroIcon,
  People as BoardIcon,
   InsertDriveFile as InsertDriveFileIcon,
} from '@mui/icons-material';

import { MessageSquareQuote } from 'lucide-react'; // ✅ Import Lucide icon

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Board Members', icon: <BoardIcon />, path: '/admin/board' },
  { text: 'Projects', icon: <ProjectsIcon />, path: '/admin/projects' },
  { text: 'Brands', icon: <BrandsIcon />, path: '/admin/brands' },
  { text: 'About', icon: <AboutIcon />, path: '/admin/about' },
    // { text: 'Add Brochure', icon: <InsertDriveFileIcon />, path: '/admin/brochure' },
  // { text: 'Hero Section', icon: <HeroIcon />, path: '/admin/hero' },
  // { text: 'Testimonials', icon: <MessageSquareQuote size={20} />, path: '/admin/testimonials' }, // ✅ Testimonials with icon
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8 }}>
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
    </Drawer>
  );
};

export default Sidebar;
