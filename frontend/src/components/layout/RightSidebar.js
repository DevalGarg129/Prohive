'use client';
// src/components/layout/RightSidebar.js
import { useState } from 'react';
import { Box, Typography, Avatar, Button, Chip, Divider } from '@mui/material';
import { Verified } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const SUGGESTED = [
  { _id: 's1', username: 'maya_ui', fullName: 'Maya Chen', avatar: 'https://i.pravatar.cc/150?u=maya_ui', followers: 12400, isVerified: true, bio: 'UI/UX Designer' },
  { _id: 's2', username: 'arjun_dev', fullName: 'Arjun Patel', avatar: 'https://i.pravatar.cc/150?u=arjun_dev', followers: 8200, isVerified: false, bio: 'Full Stack Dev' },
  { _id: 's3', username: 'sophie_lens', fullName: 'Sophie Brown', avatar: 'https://i.pravatar.cc/150?u=sophie_lens', followers: 34100, isVerified: true, bio: 'Photographer' },
  { _id: 's4', username: 'raj_startup', fullName: 'Raj Kumar', avatar: 'https://i.pravatar.cc/150?u=raj_startup', followers: 5600, isVerified: false, bio: 'Entrepreneur' },
];

const TRENDING = ['#BuildInPublic', '#UIDesign', '#NextJS', '#StartupLife', '#Photography', '#IndieHacker', '#ReactJS', '#OpenSource'];

export default function RightSidebar() {
  const { user } = useSelector((s) => s.auth);
  const router = useRouter();
  const [followed, setFollowed] = useState({});

  return (
    <Box sx={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 2 }}>

      {/* Current user card */}
      {user && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Box
            onClick={() => router.push(`/profile/${user.username}`)}
            sx={{
              background: '#fff',
              borderRadius: '18px',
              border: '1px solid rgba(192,57,43,0.07)',
              p: 2, display: 'flex', alignItems: 'center', gap: 1.5,
              cursor: 'pointer',
              boxShadow: '0 2px 14px rgba(192,57,43,0.04)',
              '&:hover': { boxShadow: '0 6px 22px rgba(192,57,43,0.10)', transform: 'translateY(-1px)' },
              transition: 'all 0.22s ease',
            }}
          >
            <Avatar
              src={user.avatar}
              sx={{ width: 50, height: 50, border: '2.5px solid rgba(192,57,43,0.22)', fontSize: '1.1rem' }}
            >
              {user.fullName?.[0]}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.9rem', color: '#1C1010', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.fullName}
                </Typography>
                {user.isVerified && <Verified sx={{ fontSize: 13, color: '#C0392B', flexShrink: 0 }} />}
              </Box>
              <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.75rem', color: '#bbb' }}>
                @{user.username}
              </Typography>
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Suggested users */}
      <Box sx={{ background: '#fff', borderRadius: '18px', border: '1px solid rgba(192,57,43,0.07)', p: 2.5, boxShadow: '0 2px 14px rgba(192,57,43,0.04)' }}>
        <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.88rem', color: '#1C1010', mb: 2 }}>
          Suggested for you
        </Typography>

        {SUGGESTED.map((su, idx) => (
          <motion.div
            key={su._id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: idx < SUGGESTED.length - 1 ? 1.8 : 0 }}>
              <Avatar
                src={su.avatar}
                onClick={() => router.push(`/profile/${su.username}`)}
                sx={{ width: 38, height: 38, cursor: 'pointer', '&:hover': { opacity: 0.85 }, fontSize: '0.85rem' }}
              >
                {su.fullName[0]}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                  <Typography
                    onClick={() => router.push(`/profile/${su.username}`)}
                    sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.8rem', color: '#1C1010', cursor: 'pointer', '&:hover': { color: '#C0392B' }, transition: 'color 0.18s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {su.username}
                  </Typography>
                  {su.isVerified && <Verified sx={{ fontSize: 11, color: '#C0392B', flexShrink: 0 }} />}
                </Box>
                <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.7rem', color: '#bbb' }}>
                  {su.followers >= 1000 ? `${(su.followers / 1000).toFixed(1)}k` : su.followers} followers
                </Typography>
              </Box>
              <Button
                size="small"
                variant={followed[su._id] ? 'outlined' : 'contained'}
                onClick={() => setFollowed((p) => ({ ...p, [su._id]: !p[su._id] }))}
                sx={{ fontSize: '0.7rem', px: 1.4, py: 0.4, minWidth: 72, fontWeight: 700, fontFamily: '"Nunito", sans-serif', borderRadius: '50px', flexShrink: 0 }}
              >
                {followed[su._id] ? 'Following' : 'Follow'}
              </Button>
            </Box>
          </motion.div>
        ))}
      </Box>

      {/* Trending tags */}
      <Box sx={{ background: '#fff', borderRadius: '18px', border: '1px solid rgba(192,57,43,0.07)', p: 2.5, boxShadow: '0 2px 14px rgba(192,57,43,0.04)' }}>
        <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.88rem', color: '#1C1010', mb: 1.5 }}>
          Trending Topics
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7 }}>
          {TRENDING.map((tag, idx) => (
            <motion.div key={tag} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.03 }}>
              <Chip
                label={tag}
                size="small"
                sx={{ background: 'rgba(192,57,43,0.06)', color: '#C0392B', fontWeight: 700, cursor: 'pointer', fontSize: '0.72rem', '&:hover': { background: 'rgba(192,57,43,0.14)' }, transition: 'background 0.18s' }}
              />
            </motion.div>
          ))}
        </Box>
      </Box>

      <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.7rem', color: '#ddd', px: 0.5 }}>
        © 2024 Prohive · Privacy · Terms
      </Typography>
    </Box>
  );
}
