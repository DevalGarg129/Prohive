'use client';
// src/app/auth/register/page.js
import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Alert,
  InputAdornment, IconButton, Link, LinearProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Favorite, CheckCircle } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

function PasswordStrength({ password }) {
  const getStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strength = getStrength(password);
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#E74C3C', '#E67E22', '#F1C40F', '#27AE60'];

  if (!password) return null;
  return (
    <Box sx={{ mt: 0.5 }}>
      <LinearProgress
        variant="determinate"
        value={(strength / 4) * 100}
        sx={{
          height: 4, borderRadius: 2,
          background: 'rgba(192,57,43,0.1)',
          '& .MuiLinearProgress-bar': { background: colors[strength], borderRadius: 2, transition: 'all 0.4s ease' },
        }}
      />
      <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.72rem', color: colors[strength], fontWeight: 700, mt: 0.4 }}>
        {labels[strength]}
      </Typography>
    </Box>
  );
}

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error, isAuthenticated } = useSelector((s) => s.auth);
  const [showPw, setShowPw] = useState(false);
  const [pwValue, setPwValue] = useState('');

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  useEffect(() => {
    if (isAuthenticated) router.push('/feed');
    return () => dispatch(clearError());
  }, [isAuthenticated, router, dispatch]);

  const onSubmit = async (data) => {
    const res = await dispatch(registerUser({ fullName: data.fullName, username: data.username, email: data.email, password: data.password }));
    if (registerUser.fulfilled.match(res)) router.push('/feed');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', background: '#FDF6F0' }}>

      {/* Left panel */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        flex: '0 0 42%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #7F0000 0%, #C0392B 45%, #E67E22 75%, #F39C12 100%)',
        position: 'relative',
        overflow: 'hidden',
        p: 6,
      }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Box key={i} sx={{ position: 'absolute', borderRadius: '50%', border: `1px solid rgba(255,255,255,${0.05 + i * 0.02})`, width: `${100 + i * 80}px`, height: `${100 + i * 80}px`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        ))}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', zIndex: 1 }}>
          <Box sx={{ width: 72, height: 72, borderRadius: '20px', mx: 'auto', mb: 3, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Favorite sx={{ fontSize: 34, color: '#fff' }} />
          </Box>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontSize: '2.8rem', color: '#fff', mb: 1.5 }}>
            Join Prohive
          </Typography>
          <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.72)', maxWidth: 300, lineHeight: 1.55 }}>
            Build your professional presence and connect with creators worldwide.
          </Typography>

          {/* Feature bullets */}
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 1.5, textAlign: 'left' }}>
            {['Showcase your work & projects', 'Connect with industry professionals', 'Stay updated on trending topics', 'Grow your personal brand'].map((feat, i) => (
              <motion.div key={feat} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <CheckCircle sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, flexShrink: 0 }} />
                  <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.88rem', color: 'rgba(255,255,255,0.82)', fontWeight: 500 }}>
                    {feat}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Box>

      {/* Right form */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 3, md: 5 }, overflowY: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 4 }}>
            <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg, #C0392B, #E67E22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Favorite sx={{ color: '#fff', fontSize: 17 }} />
            </Box>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontSize: '1.5rem', background: 'linear-gradient(135deg, #C0392B, #E67E22)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Prohive
            </Typography>
          </Box>

          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontSize: '1.9rem', color: '#1C1010', mb: 0.5 }}>
            Create your account
          </Typography>
          <Typography sx={{ fontFamily: '"Nunito", sans-serif', color: '#bbb', mb: 3, fontSize: '0.9rem' }}>
            Free forever · No credit card needed
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }} onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
            <TextField
              label="Full Name"
              fullWidth
              {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Too short' } })}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
            <TextField
              label="Username"
              fullWidth
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Min 3 characters' },
                maxLength: { value: 30, message: 'Max 30 characters' },
                pattern: { value: /^[a-zA-Z0-9_.]+$/, message: 'Only letters, numbers, _ and .' },
              })}
              error={!!errors.username}
              helperText={errors.username?.message}
              InputProps={{ startAdornment: <Typography sx={{ color: '#bbb', mr: 0.5, fontFamily: '"Nunito", sans-serif' }}>@</Typography> }}
            />
            <TextField
              label="Email address"
              type="email"
              fullWidth
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <Box>
              <TextField
                label="Password"
                type={showPw ? 'text' : 'password'}
                fullWidth
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' }, onChange: (e) => setPwValue(e.target.value) })}
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
              <PasswordStrength password={pwValue} />
            </Box>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" variant="contained" fullWidth disabled={isLoading} sx={{ py: 1.5, fontSize: '0.96rem', fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </motion.div>

            <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.75rem', color: '#ccc', textAlign: 'center', lineHeight: 1.5 }}>
              By signing up, you agree to our{' '}
              <Link href="#" sx={{ color: '#C0392B', fontWeight: 700 }}>Terms</Link>{' '}and{' '}
              <Link href="#" sx={{ color: '#C0392B', fontWeight: 700 }}>Privacy Policy</Link>.
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2.5 }}>
            <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.88rem', color: '#aaa' }}>
              Already have an account?{' '}
              <Link href="/auth/login" sx={{ color: '#C0392B', fontWeight: 800, '&:hover': { textDecoration: 'underline' } }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
