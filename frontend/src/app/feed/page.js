'use client';
// src/app/feed/page.js
import { useEffect, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, Fab } from '@mui/material';
import { AddRounded, AutoAwesome } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeed } from '@/store/slices/postSlice';
import { openCreatePost } from '@/store/slices/uiSlice';
import AppLayout from '@/components/layout/AppLayout';
import PostCard from '@/components/post/PostCard';
import StoriesBar from '@/components/story/StoriesBar';
import RightSidebar from '@/components/layout/RightSidebar';

// Mock posts for demo when backend isn't running
const DEMO_POSTS = [
  {
    _id: 'demo1',
    author: { _id: 'u1', username: 'maya_ui', fullName: 'Maya Chen', avatar: 'https://i.pravatar.cc/150?u=maya_ui', isVerified: true },
    content: 'Just shipped a brand new design system for our startup! Took 3 weeks but the result is absolutely worth it. Consistency is everything. 🎨 #UIDesign #BuildInPublic',
    images: ['https://picsum.photos/800/500?random=10'],
    likes: ['u2', 'u3', 'u4', 'u5'],
    comments: [
      { _id: 'c1', user: { _id: 'u2', username: 'arjun_dev', fullName: 'Arjun Patel', avatar: 'https://i.pravatar.cc/150?u=arjun_dev' }, text: 'This looks incredible! Love the color palette 🔥', createdAt: new Date().toISOString() }
    ],
    tags: ['UIDesign', 'BuildInPublic'],
    location: 'San Francisco, CA',
    isLiked: false,
    isSaved: false,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    _id: 'demo2',
    author: { _id: 'u2', username: 'arjun_dev', fullName: 'Arjun Patel', avatar: 'https://i.pravatar.cc/150?u=arjun_dev', isVerified: false },
    content: 'Next.js 14 App Router has completely changed how I build applications. Server components are a game changer. Here\'s what I learned after 30 days of using it in production. #NextJS #ReactJS',
    images: [],
    likes: ['u1', 'u3'],
    comments: [],
    tags: ['NextJS', 'ReactJS'],
    isLiked: false,
    isSaved: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'demo3',
    author: { _id: 'u3', username: 'sophie_lens', fullName: 'Sophie Brown', avatar: 'https://i.pravatar.cc/150?u=sophie_lens', isVerified: true },
    content: 'Golden hour magic in the mountains. Sometimes you just need to disconnect and let nature do the talking. 📸',
    images: ['https://picsum.photos/800/600?random=22', 'https://picsum.photos/800/600?random=33'],
    likes: ['u1', 'u2', 'u4', 'u5', 'u6'],
    comments: [
      { _id: 'c2', user: { _id: 'u1', username: 'maya_ui', fullName: 'Maya Chen', avatar: 'https://i.pravatar.cc/150?u=maya_ui' }, text: 'Absolutely breathtaking! Where is this?', createdAt: new Date().toISOString() }
    ],
    tags: ['Photography'],
    location: 'Himachal Pradesh, India',
    isLiked: false,
    isSaved: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'demo4',
    author: { _id: 'u4', username: 'raj_startup', fullName: 'Raj Kumar', avatar: 'https://i.pravatar.cc/150?u=raj_startup', isVerified: false },
    content: 'We just crossed 1000 users on our SaaS product! Started 6 months ago with just an idea and a landing page. Here\'s the full breakdown of what worked and what didn\'t 👇\n\n1️⃣ Reddit posts > cold emails\n2️⃣ Indie Hackers community is gold\n3️⃣ Solve ONE problem extremely well #StartupLife #IndieHacker #BuildInPublic',
    images: [],
    likes: ['u1', 'u2', 'u3', 'u5', 'u6', 'u7'],
    comments: [],
    tags: ['StartupLife', 'IndieHacker', 'BuildInPublic'],
    isLiked: false,
    isSaved: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
];

function EmptyFeed({ onCreatePost }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Box sx={{
        textAlign: 'center', py: 10,
        background: '#fff', borderRadius: '20px',
        border: '1px solid rgba(192,57,43,0.07)',
        boxShadow: '0 2px 14px rgba(192,57,43,0.04)',
      }}>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          style={{ fontSize: 56, marginBottom: 12 }}
        >
          🌱
        </motion.div>
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', fontWeight: 700, color: '#1C1010', mb: 1 }}>
          Your feed is empty
        </Typography>
        <Typography sx={{ fontFamily: '"Nunito", sans-serif', color: '#bbb', mb: 3, fontSize: '0.92rem' }}>
          Follow people or create your first post to get started
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={onCreatePost} startIcon={<AddRounded />} sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700 }}>
            Create a Post
          </Button>
          <Button variant="outlined" href="/explore" sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700 }}>
            Explore Users
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
}

export default function FeedPage() {
  const dispatch = useDispatch();
  const { feedPosts, isLoading, hasMore, page } = useSelector((s) => s.posts);
  const { isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFeed({ page: 1, reset: true }));
    }
  }, [dispatch, isAuthenticated]);

  // Use demo posts if feed is empty (for demo/dev purposes)
  const displayPosts = feedPosts.length > 0 ? feedPosts : DEMO_POSTS;

  return (
    <AppLayout>
      <Box sx={{
        maxWidth: 1080, mx: 'auto',
        px: { xs: 2, md: 3 },
        py: 3,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' },
        gap: 3,
      }}>
        {/* Main feed column */}
        <Box>
          <StoriesBar />

          {isLoading && feedPosts.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
              <CircularProgress sx={{ color: '#C0392B' }} />
            </Box>
          ) : (
            <AnimatePresence>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {displayPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </Box>
            </AnimatePresence>
          )}

          {/* Load more */}
          {hasMore && feedPosts.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                onClick={() => dispatch(fetchFeed({ page: page + 1 }))}
                disabled={isLoading}
                sx={{ color: '#C0392B', fontFamily: '"Nunito", sans-serif', fontWeight: 700, '&:hover': { background: 'rgba(192,57,43,0.06)' } }}
              >
                {isLoading ? <CircularProgress size={20} sx={{ color: '#C0392B' }} /> : 'Load more posts'}
              </Button>
            </Box>
          )}
        </Box>

        {/* Right sidebar */}
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <RightSidebar />
        </Box>
      </Box>
    </AppLayout>
  );
}
