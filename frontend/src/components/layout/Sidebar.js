'use client';
// src/components/layout/Sidebar.js
import { useState } from 'react';
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Typography, Badge, Divider, IconButton, Tooltip,
} from '@mui/material';
import {
  Home, Explore, AddCircleOutline, NotificationsNone, PersonOutline,
  BookmarkBorder, LogoutOutlined, MenuOpen, Menu, Favorite,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { openCreatePost } from '@/store/slices/uiSlice';

const NAV = [
  { label: 'Home',          icon: Home,                   path: '/feed' },
  { label: 'Explore',       icon: Explore,                path: '/explore' },
  { label: 'Create',        icon: AddCircleOutline,       path: null,       action: 'create' },
  { label: 'Notifications', icon: NotificationsNone,      path: '/notifications', badge: true },
  { label: 'Saved',         icon: BookmarkBorder,         path: '/saved' },
  { label: 'Profile',       icon: PersonOutline,          path: '/profile', dynamic: true },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { unread } = useSelector((s) => s.notifications);

  const handleNav = (item) => {
    if (item.action === 'create') return dispatch(openCreatePost());
    if (item.dynamic && user) return router.push(`/profile/${user.username}`);
    if (item.path) router.push(item.path);
  };

  const isActive = (item) => {
    if (item.dynamic) return pathname.startsWith('/profile');
    return pathname === item.path;
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 256 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100,
        background: '#fff',
        borderRight: '1px solid rgba(192,57,43,0.07)',
        boxShadow: '2px 0 18px rgba(192,57,43,0.04)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}
    >
      {/* Top: Logo + collapse btn */}
      <Box sx={{ px: 2, pt: 3, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 72 }}>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              onClick={() => router.push('/feed')}
            >
              <Box sx={{
                width: 34, height: 34, borderRadius: '10px',
                background: 'linear-gradient(135deg, #C0392B, #E67E22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(192,57,43,0.3)',
                flexShrink: 0,
              }}>
                <Favorite sx={{ color: '#fff', fontSize: 18 }} />
              </Box>
              <Typography sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 700, fontSize: '1.45rem', letterSpacing: '-0.01em',
                background: 'linear-gradient(135deg, #C0392B, #E67E22)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Prohive
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <Box
            onClick={() => router.push('/feed')}
            sx={{
              width: 38, height: 38, borderRadius: '11px', mx: 'auto',
              background: 'linear-gradient(135deg, #C0392B, #E67E22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 3px 10px rgba(192,57,43,0.3)',
            }}
          >
            <Favorite sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
        )}

        {!collapsed && (
          <IconButton size="small" onClick={() => setCollapsed(true)} sx={{ color: '#bbb', ml: 0.5 }}>
            <MenuOpen fontSize="small" />
          </IconButton>
        )}
      </Box>

      {collapsed && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pb: 1 }}>
          <IconButton size="small" onClick={() => setCollapsed(false)} sx={{ color: '#bbb' }}>
            <Menu fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Nav items */}
      <List sx={{ flex: 1, px: 1.5, pt: 0.5 }}>
        {NAV.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Tooltip key={item.label} title={collapsed ? item.label : ''} placement="right">
              <ListItemButton
                onClick={() => handleNav(item)}
                sx={{
                  borderRadius: '12px', mb: 0.5,
                  py: 1.3, px: collapsed ? 1.2 : 1.6,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  position: 'relative', overflow: 'visible',
                  background: active ? 'linear-gradient(135deg, rgba(192,57,43,0.10), rgba(230,126,34,0.06))' : 'transparent',
                  color: active ? '#C0392B' : '#7A5050',
                  '&:hover': { background: 'rgba(192,57,43,0.07)', color: '#C0392B' },
                  transition: 'all 0.18s ease',
                }}
              >
                {/* Active indicator pill */}
                {active && (
                  <motion.div
                    layoutId="activeBar"
                    style={{
                      position: 'absolute', left: -6, top: '50%', translateY: '-50%',
                      width: 4, height: 22,
                      background: 'linear-gradient(180deg, #C0392B, #E67E22)',
                      borderRadius: 3,
                    }}
                  />
                )}

                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 38, color: 'inherit' }}>
                  {item.badge ? (
                    <Badge badgeContent={unread || 0} color="primary" max={9}>
                      <Icon sx={{ fontSize: 22 }} />
                    </Badge>
                  ) : (
                    <Icon sx={{ fontSize: 22 }} />
                  )}
                </ListItemIcon>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontFamily: '"Nunito", sans-serif',
                          fontWeight: active ? 800 : 600,
                          fontSize: '0.9rem',
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* User + logout */}
      <Box sx={{ p: 1.5 }}>
        {user && !collapsed && (
          <Box
            onClick={() => router.push(`/profile/${user.username}`)}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              p: 1.2, borderRadius: '12px', cursor: 'pointer',
              '&:hover': { background: 'rgba(192,57,43,0.05)' },
              transition: 'background 0.18s',
              mb: 0.5,
            }}
          >
            <Avatar
              src={user.avatar}
              sx={{ width: 36, height: 36, border: '2px solid rgba(192,57,43,0.25)', fontSize: '0.85rem' }}
            >
              {user.fullName?.[0]}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.85rem', color: '#1C1010', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.fullName}
              </Typography>
              <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.72rem', color: '#aaa' }}>
                @{user.username}
              </Typography>
            </Box>
          </Box>
        )}

        <Tooltip title={collapsed ? 'Logout' : ''} placement="right">
          <ListItemButton
            onClick={() => { dispatch(logout()); router.push('/auth/login'); }}
            sx={{
              borderRadius: '12px', py: 1.1,
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: '#bbb',
              '&:hover': { color: '#C0392B', background: 'rgba(192,57,43,0.06)' },
              transition: 'all 0.18s',
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: 'inherit' }}>
              <LogoutOutlined fontSize="small" />
            </ListItemIcon>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ListItemText primary="Log out" primaryTypographyProps={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, fontSize: '0.88rem' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </ListItemButton>
        </Tooltip>
      </Box>
    </motion.aside>
  );
}
