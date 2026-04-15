'use client';
// src/app/auth/login/page.js
import { useState } from 'react';
import {
  Box, Typography, TextField, Button, Alert,
  InputAdornment, IconButton, Link, Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, Favorite } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const TAGLINES = ['Where professionals connect.', 'Create. Share. Grow.', 'Your story starts here.'];

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error, isAuthenticated } = useSelector((s) => s.auth);
  const [showPw, setShowPw] = useState(false);
  const [taglineIdx] = useState(Math.floor(Math.random() * TAGLINES.length));

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated) router.push('/feed');
    return () => dispatch(clearError());
  }, [isAuthenticated, router, dispatch]);

  const onSubmit = async (data) => {
    const res = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(res)) router.push('/feed');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', background: '#FDF6F0' }}>

      {/* Left decorative panel */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        flex: '0 0 46%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'linear-gradient(145deg, #7F0000 0%, #C0392B 40%, #E67E22 80%, #F39C12 100%)',
        overflow: 'hidden',
        p: 6,
      }}>
        {/* Background rings */}
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Box key={i} sx={{
            position: 'absolute',
            borderRadius: '50%',
            border: `1px solid rgba(255,255,255,${0.04 + i * 0.02})`,
            width: `${80 + i * 70}px`, height: `${80 + i * 70}px`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
          }} />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ textAlign: 'center', zIndex: 1 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Box sx={{
              width: 80, height: 80, borderRadius: '24px', mx: 'auto', mb: 3,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}>
              <Favorite sx={{ fontSize: 38, color: '#fff' }} />
            </Box>
          </motion.div>

          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontSize: '3rem', color: '#fff', lineHeight: 1, mb: 1.5, letterSpacing: '-0.02em' }}>
            Prohive
          </Typography>
          <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', fontWeight: 400, mb: 4 }}>
            {TAGLINES[taglineIdx]}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Connect', 'Create', 'Inspire', 'Grow'].map((word, i) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <Box sx={{
                  px: 2, py: 0.7,
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '50px',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                  <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.8rem', color: '#fff', letterSpacing: '0.04em' }}>
                    {word}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Box>

      {/* Right form panel */}
      <Box sx={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', p: { xs: 3, md: 6 },
      }}>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 4 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #C0392B, #E67E22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Favorite sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontSize: '1.6rem', background: 'linear-gradient(135deg, #C0392B, #E67E22)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Prohive
            </Typography>
          </Box>

          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontSize: '2rem', color: '#1C1010', mb: 0.5 }}>
            Welcome back
          </Typography>
          <Typography sx={{ fontFamily: '"Nunito", sans-serif', color: '#bbb', mb: 3.5, fontSize: '0.92rem' }}>
            Sign in to continue your journey
          </Typography>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }} onClose={() => dispatch(clearError())}>
                {error}
              </Alert>
            </motion.div>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Email address"
              type="email"
              fullWidth
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type={showPw ? 'text' : 'password'}
              fullWidth
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPw(!showPw)} edge="end">
                      {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right', mt: -1 }}>
              <Link href="/auth/forgot-password" sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.82rem', fontWeight: 700, color: '#C0392B', '&:hover': { textDecoration: 'underline' } }}>
                Forgot password?
              </Link>
            </Box>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{ py: 1.5, fontSize: '0.96rem', fontWeight: 800, letterSpacing: '0.02em', fontFamily: '"Nunito", sans-serif' }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </motion.div>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.88rem', color: '#aaa' }}>
              Don't have an account?{' '}
              <Link href="/auth/register" sx={{ color: '#C0392B', fontWeight: 800, '&:hover': { textDecoration: 'underline' } }}>
                Sign up free
              </Link>
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
