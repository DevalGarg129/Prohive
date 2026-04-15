'use client';
// src/components/layout/AppLayout.js
import { Box, BottomNavigation, BottomNavigationAction, Badge, useMediaQuery, useTheme } from '@mui/material';
import { Home, Explore, AddCircle, Notifications, Person } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { openCreatePost } from '@/store/slices/uiSlice';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import CreatePostModal from '@/components/post/CreatePostModal';

export default function AppLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { createPostOpen } = useSelector((s) => s.ui);
  const { unread } = useSelector((s) => s.notifications);

  const mobileNavValue = () => {
    if (pathname === '/feed') return 0;
    if (pathname === '/explore') return 1;
    if (pathname.startsWith('/notifications')) return 3;
    if (pathname.startsWith('/profile')) return 4;
    return false;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#FDF6F0' }}>
      {/* Sidebar — desktop only */}
      {!isMobile && <Sidebar />}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          ml: isMobile ? 0 : '256px',
          pb: isMobile ? '70px' : 0,
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </Box>

      {/* Mobile Bottom Nav */}
      {isMobile && (
        <BottomNavigation
          value={mobileNavValue()}
          sx={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
            height: 62,
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(192,57,43,0.08)',
            boxShadow: '0 -4px 20px rgba(192,57,43,0.06)',
            '& .MuiBottomNavigationAction-root': { color: '#bbb', '&.Mui-selected': { color: '#C0392B' } },
          }}
        >
          <BottomNavigationAction icon={<Home />} onClick={() => router.push('/feed')} />
          <BottomNavigationAction icon={<Explore />} onClick={() => router.push('/explore')} />
          <BottomNavigationAction
            icon={
              <Box sx={{ background: 'linear-gradient(135deg, #C0392B, #922B21)', borderRadius: '50%', p: 1, color: '#fff', display: 'flex', boxShadow: '0 4px 14px rgba(192,57,43,0.38)' }}>
                <AddCircle sx={{ fontSize: 26 }} />
              </Box>
            }
            onClick={() => dispatch(openCreatePost())}
          />
          <BottomNavigationAction icon={<Badge badgeContent={unread} color="primary" max={9}><Notifications /></Badge>} onClick={() => router.push('/notifications')} />
          <BottomNavigationAction icon={<Person />} onClick={() => user && router.push(`/profile/${user.username}`)} />
        </BottomNavigation>
      )}

      <CreatePostModal open={createPostOpen} onClose={() => dispatch({ type: 'ui/closeCreatePost' })} />
    </Box>
  );
}
