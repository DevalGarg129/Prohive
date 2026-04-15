'use client';
// src/app/explore/page.js
import { useState } from 'react';
import {
  Box, Typography, TextField, InputAdornment, Card,
  Avatar, Button, Chip, Tabs, Tab,
} from '@mui/material';
import { Search, Verified } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { useRouter } from 'next/navigation';

const EXPLORE_IMAGES = Array.from({ length: 15 }, (_, i) => ({
  id: `ei${i}`,
  src: `https://picsum.photos/400/400?random=${i + 200}`,
  likes: Math.floor(Math.random() * 500 + 20),
  comments: Math.floor(Math.random() * 80),
}));

const PEOPLE = [
  { id: '1', username: 'maya_ui', fullName: 'Maya Chen', avatar: 'https://i.pravatar.cc/150?u=maya_ui2', isVerified: true, bio: 'UI/UX Designer ✦ Design systems & products', followers: 12400 },
  { id: '2', username: 'arjun_dev', fullName: 'Arjun Patel', avatar: 'https://i.pravatar.cc/150?u=arjun_dev2', isVerified: false, bio: 'Full Stack Dev ✦ Open source enthusiast', followers: 8200 },
  { id: '3', username: 'sophie_lens', fullName: 'Sophie Brown', avatar: 'https://i.pravatar.cc/150?u=sophie_lens2', isVerified: true, bio: 'Travel Photographer ✦ 35+ countries', followers: 34100 },
  { id: '4', username: 'raj_startup', fullName: 'Raj Kumar', avatar: 'https://i.pravatar.cc/150?u=raj_startup2', isVerified: false, bio: 'Entrepreneur ✦ SaaS builder', followers: 5600 },
  { id: '5', username: 'zoe_brand', fullName: 'Zoe Williams', avatar: 'https://i.pravatar.cc/150?u=zoe_brand', isVerified: true, bio: 'Brand Strategist ✦ Storyteller', followers: 22000 },
  { id: '6', username: 'alex_code', fullName: 'Alex Morgan', avatar: 'https://i.pravatar.cc/150?u=alex_code', isVerified: false, bio: 'Software Engineer ✦ AI/ML projects', followers: 9800 },
];

const TAGS = ['#BuildInPublic', '#UIDesign', '#NextJS', '#StartupLife', '#Photography', '#IndieHacker', '#ReactJS', '#OpenSource', '#SaaS', '#DevLife', '#ProductDesign', '#TypeScript', '#MongoDB', '#CreativeCode', '#TechTwitter'];

export default function ExplorePage() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState('');
  const [followed, setFollowed] = useState({});
  const [hovered, setHovered] = useState(null);

  const filteredPeople = PEOPLE.filter((p) =>
    p.username.toLowerCase().includes(query.toLowerCase()) ||
    p.fullName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 960, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontSize: '2rem', color: '#1C1010', mb: 0.5 }}>
            Explore
          </Typography>
          <Typography sx={{ fontFamily: '"Nunito", sans-serif', color: '#bbb', mb: 3, fontSize: '0.9rem' }}>
            Discover people, posts and trending topics
          </Typography>

          <TextField
            fullWidth
            placeholder="Search people, tags, topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'rgba(192,57,43,0.5)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
                background: '#fff',
                boxShadow: '0 2px 12px rgba(192,57,43,0.05)',
              },
            }}
          />
        </motion.div>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 3,
            '& .MuiTab-root': { fontFamily: '"Nunito", sans-serif', fontWeight: 700, textTransform: 'none', color: '#bbb', '&.Mui-selected': { color: '#C0392B' } },
            '& .MuiTabs-indicator': { background: 'linear-gradient(90deg, #C0392B, #E67E22)', height: 3, borderRadius: 2 },
          }}
        >
          <Tab label="Posts" />
          <Tab label="People" />
          <Tab label="Tags" />
        </Tabs>

        <AnimatePresence mode="wait">

          {/* ── Posts grid ── */}
          {tab === 0 && (
            <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: { xs: 1, md: 1.5 } }}>
                {EXPLORE_IMAGES.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    onHoverStart={() => setHovered(item.id)}
                    onHoverEnd={() => setHovered(null)}
                  >
                    <Box sx={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', aspectRatio: '1/1', cursor: 'pointer' }}>
                      <img
                        src={item.src}
                        alt="explore"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      <AnimatePresence>
                        {hovered === item.id && (
                          <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(28,16,16,0.52)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28 }}
                          >
                            <Box sx={{ textAlign: 'center', color: '#fff' }}>
                              <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '1.1rem' }}>♥ {item.likes}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', color: '#fff' }}>
                              <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '1.1rem' }}>💬 {item.comments}</Typography>
                            </Box>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          )}

          {/* ── People grid ── */}
          {tab === 1 && (
            <motion.div key="people" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                {filteredPeople.map((person, idx) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <Card sx={{ p: 2.5, borderRadius: '18px', textAlign: 'center', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 30px rgba(192,57,43,0.12)' } }}>
                      <Box sx={{ p: '3px', borderRadius: '50%', background: 'linear-gradient(135deg, #C0392B, #E67E22)', display: 'inline-block', mb: 1.5 }}>
                        <Box sx={{ p: '2.5px', borderRadius: '50%', background: '#fff', display: 'inline-block' }}>
                          <Avatar
                            src={person.avatar}
                            sx={{ width: 70, height: 70, cursor: 'pointer' }}
                            onClick={() => router.push(`/profile/${person.username}`)}
                          >
                            {person.fullName[0]}
                          </Avatar>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.3 }}>
                        <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.92rem', color: '#1C1010' }}>
                          {person.fullName}
                        </Typography>
                        {person.isVerified && <Verified sx={{ fontSize: 14, color: '#C0392B' }} />}
                      </Box>
                      <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.76rem', color: '#bbb', mb: 1 }}>@{person.username}</Typography>
                      <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.78rem', color: '#666', mb: 1.5, lineHeight: 1.45 }}>
                        {person.bio}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.76rem', color: '#bbb', fontWeight: 700, mb: 2 }}>
                        {person.followers >= 1000 ? `${(person.followers / 1000).toFixed(1)}k` : person.followers} followers
                      </Typography>
                      <Button
                        variant={followed[person.id] ? 'outlined' : 'contained'}
                        fullWidth size="small"
                        onClick={() => setFollowed((p) => ({ ...p, [person.id]: !p[person.id] }))}
                        sx={{ borderRadius: '50px', fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.8rem' }}
                      >
                        {followed[person.id] ? 'Following' : 'Follow'}
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          )}

          {/* ── Tags ── */}
          {tab === 2 && (
            <motion.div key="tags" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {TAGS.filter((t) => t.toLowerCase().includes(query.toLowerCase())).map((tag, idx) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.82 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Chip
                      label={tag}
                      sx={{
                        background: '#fff',
                        border: '1.5px solid rgba(192,57,43,0.15)',
                        color: '#C0392B', fontWeight: 800, cursor: 'pointer',
                        fontSize: '0.88rem', px: 1, py: 2.8,
                        boxShadow: '0 2px 8px rgba(192,57,43,0.06)',
                        '&:hover': { background: 'rgba(192,57,43,0.06)', borderColor: '#C0392B' },
                        transition: 'all 0.18s',
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </AppLayout>
  );
}
