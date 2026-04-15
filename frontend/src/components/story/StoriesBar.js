'use client';
// src/components/story/StoriesBar.js
import { useRef } from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const MOCK_STORIES = [
  { id: '1', username: 'alex_m', avatar: 'https://i.pravatar.cc/150?u=alex_m', hasUnviewed: true },
  { id: '2', username: 'sarah_k', avatar: 'https://i.pravatar.cc/150?u=sarah_k', hasUnviewed: true },
  { id: '3', username: 'mike_r', avatar: 'https://i.pravatar.cc/150?u=mike_r', hasUnviewed: false },
  { id: '4', username: 'emma_j', avatar: 'https://i.pravatar.cc/150?u=emma_j', hasUnviewed: true },
  { id: '5', username: 'chris_p', avatar: 'https://i.pravatar.cc/150?u=chris_p', hasUnviewed: true },
  { id: '6', username: 'dev_a', avatar: 'https://i.pravatar.cc/150?u=dev_a', hasUnviewed: false },
  { id: '7', username: 'nina_v', avatar: 'https://i.pravatar.cc/150?u=nina_v', hasUnviewed: true },
];

function StoryRing({ hasUnviewed, size = 64 }) {
  return (
    <Box sx={{
      p: '2.5px',
      borderRadius: '50%',
      background: hasUnviewed
        ? 'linear-gradient(135deg, #C0392B 0%, #E67E22 50%, #F1C40F 100%)'
        : 'rgba(192,57,43,0.15)',
    }}>
      <Box sx={{ p: '2.5px', borderRadius: '50%', background: '#FDF6F0' }}>
        <Box sx={{ p: '0px', borderRadius: '50%', background: '#fff', display: 'block' }}>
          {/* children go here */}
        </Box>
      </Box>
    </Box>
  );
}

export default function StoriesBar() {
  const { user } = useSelector((s) => s.auth);
  const scrollRef = useRef(null);

  return (
    <Box sx={{
      background: '#fff',
      borderRadius: '18px',
      border: '1px solid rgba(192,57,43,0.07)',
      boxShadow: '0 2px 14px rgba(192,57,43,0.04)',
      p: 2, mb: 2.5,
    }}>
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex', gap: 2, overflowX: 'auto', pb: 0.5,
          scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {/* Add your story */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flexShrink: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.7, cursor: 'pointer', minWidth: 64 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={user?.avatar}
                sx={{ width: 58, height: 58, border: '2px dashed rgba(192,57,43,0.3)', fontSize: '1.1rem' }}
              >
                {user?.fullName?.[0]}
              </Avatar>
              <Box sx={{
                position: 'absolute', bottom: 0, right: 0,
                background: 'linear-gradient(135deg, #C0392B, #E67E22)',
                borderRadius: '50%', width: 20, height: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #FDF6F0',
              }}>
                <Add sx={{ fontSize: 12, color: '#fff' }} />
              </Box>
            </Box>
            <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.68rem', color: '#888', fontWeight: 600, textAlign: 'center' }}>
              Your Story
            </Typography>
          </Box>
        </motion.div>

        {/* Others' stories */}
        {MOCK_STORIES.map((story, idx) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            style={{ flexShrink: 0 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.7, cursor: 'pointer', minWidth: 64 }}>
              <Box sx={{
                p: '2.5px',
                borderRadius: '50%',
                background: story.hasUnviewed
                  ? 'linear-gradient(135deg, #C0392B 0%, #E67E22 60%, #F1C40F 100%)'
                  : 'rgba(192,57,43,0.12)',
              }}>
                <Box sx={{ p: '2.5px', borderRadius: '50%', background: '#FDF6F0' }}>
                  <Avatar src={story.avatar} sx={{ width: 52, height: 52, fontSize: '0.9rem' }}>
                    {story.username[0].toUpperCase()}
                  </Avatar>
                </Box>
              </Box>
              <Typography sx={{
                fontFamily: '"Nunito", sans-serif', fontSize: '0.68rem',
                color: story.hasUnviewed ? '#1C1010' : '#bbb',
                fontWeight: story.hasUnviewed ? 700 : 500,
                textAlign: 'center', maxWidth: 62,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {story.username}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
