'use client';
// src/app/profile/[username]/page.js
import { useEffect, useState } from 'react';
import {
  Box, Typography, Avatar, Button, IconButton, Tabs, Tab,
  Grid, Skeleton, Dialog, DialogContent, TextField,
  Divider, Chip, Menu, MenuItem,
} from '@mui/material';
import {
  Edit, GridOnRounded, BookmarkBorderRounded, FavoriteRounded,
  Settings, Share, Verified, LocationOn, Link as LinkIcon,
  CalendarToday, Close, PhotoCamera, CheckRounded, PersonAdd,
  MoreHoriz,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, followUser } from '@/store/slices/profileSlice';
import { updateProfile } from '@/store/slices/authSlice';
import { fetchUserPosts } from '@/store/slices/postSlice';
import { showSnack } from '@/store/slices/uiSlice';
import AppLayout from '@/components/layout/AppLayout';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// ─── Edit Profile Modal ────────────────────────────────────────────────────────
function EditProfileModal({ open, onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    website: user?.website || '',
    location: user?.location || '',
  });
  const [saving, setSaving] = useState(false);

  const handle = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const save = async () => {
    setSaving(true);
    const res = await dispatch(updateProfile(form));
    setSaving(false);
    if (updateProfile.fulfilled.match(res)) {
      dispatch(showSnack({ message: '✓ Profile updated!', severity: 'success' }));
      onClose();
    } else {
      toast.error(res.payload || 'Update failed');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.5, borderBottom: '1px solid rgba(192,57,43,0.07)' }}>
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontSize: '1.3rem', color: '#1C1010' }}>
          Edit Profile
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: '#bbb' }}><Close /></IconButton>
      </Box>

      <DialogContent sx={{ pt: 3 }}>
        {/* Avatar upload */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3.5 }}>
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ p: '3px', borderRadius: '50%', background: 'linear-gradient(135deg, #C0392B, #E67E22)' }}>
              <Box sx={{ p: '3px', borderRadius: '50%', background: '#fff' }}>
                <Avatar
                  src={user?.avatar}
                  sx={{ width: 96, height: 96, fontSize: '2rem' }}
                >
                  {user?.fullName?.[0]}
                </Avatar>
              </Box>
            </Box>
            <motion.div
              whileHover={{ scale: 1.1 }}
              style={{
                position: 'absolute', bottom: 3, right: 3,
                background: 'linear-gradient(135deg, #C0392B, #922B21)',
                borderRadius: '50%', width: 30, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: '2.5px solid #fff',
                boxShadow: '0 2px 8px rgba(192,57,43,0.4)',
              }}
            >
              <PhotoCamera sx={{ fontSize: 15, color: '#fff' }} />
            </motion.div>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Full Name" fullWidth value={form.fullName} onChange={handle('fullName')} />
          <TextField
            label="Username" fullWidth value={form.username} onChange={handle('username')}
            InputProps={{ startAdornment: <Typography sx={{ color: '#bbb', mr: 0.5, fontFamily: '"Nunito", sans-serif' }}>@</Typography> }}
          />
          <TextField
            label="Bio" fullWidth multiline rows={3}
            value={form.bio} onChange={handle('bio')}
            inputProps={{ maxLength: 150 }}
            helperText={`${form.bio.length}/150`}
          />
          <TextField label="Website" fullWidth value={form.website} onChange={handle('website')} placeholder="https://yourwebsite.com" />
          <TextField label="Location" fullWidth value={form.location} onChange={handle('location')} placeholder="City, Country" />
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
          <Button fullWidth variant="outlined" onClick={onClose} sx={{ borderRadius: '50px', fontFamily: '"Nunito", sans-serif', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button fullWidth variant="contained" onClick={save} disabled={saving} sx={{ borderRadius: '50px', fontFamily: '"Nunito", sans-serif', fontWeight: 700 }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// ─── Post Grid ────────────────────────────────────────────────────────────────
const MOCK_GRID = Array.from({ length: 12 }, (_, i) => ({
  _id: `gp${i}`,
  images: [`https://picsum.photos/400/400?random=${i + 50}`],
  likes: Array.from({ length: Math.floor(Math.random() * 300 + 10) }),
  comments: Array.from({ length: Math.floor(Math.random() * 40) }),
}));

function PostGrid({ posts = [] }) {
  const [hovered, setHovered] = useState(null);
  const display = posts.length > 0 ? posts : MOCK_GRID;

  if (display.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography sx={{ color: '#ccc', fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem' }}>No posts yet</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: { xs: 1, md: 1.5 } }}>
      {display.map((post, idx) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.03, duration: 0.32 }}
          onHoverStart={() => setHovered(post._id)}
          onHoverEnd={() => setHovered(null)}
        >
          <Box sx={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', aspectRatio: '1/1', cursor: 'pointer' }}>
            <img
              src={post.images?.[0] || `https://picsum.photos/400/400?random=${idx + 100}`}
              alt="post"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            />
            <AnimatePresence>
              {hovered === post._id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(28,16,16,0.55)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24,
                  }}
                >
                  <Box sx={{ textAlign: 'center', color: '#fff' }}>
                    <FavoriteRounded sx={{ fontSize: 22 }} />
                    <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.9rem', mt: 0.3 }}>
                      {post.likes?.length || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', color: '#fff' }}>
                    <GridOnRounded sx={{ fontSize: 22 }} />
                    <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.9rem', mt: 0.3 }}>
                      {post.comments?.length || 0}
                    </Typography>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </motion.div>
      ))}
    </Box>
  );
}

// ─── Main Profile Page ─────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user: currentUser } = useSelector((s) => s.auth);
  const { profiles, isLoading } = useSelector((s) => s.profile);
  const { userPosts } = useSelector((s) => s.posts);

  const [tab, setTab] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const isOwn = currentUser?.username === username;
  const profileData = isOwn ? currentUser : profiles[username]?.user;
  const posts = userPosts[username] || [];

  useEffect(() => {
    if (username) {
      if (!isOwn) dispatch(fetchProfile(username));
      dispatch(fetchUserPosts(username));
    }
  }, [username, dispatch, isOwn]);

  useEffect(() => {
    if (profileData && currentUser) {
      setIsFollowing(profileData.followers?.includes(currentUser._id));
    }
  }, [profileData, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) return router.push('/auth/login');
    setFollowLoading(true);
    const res = await dispatch(followUser(profileData._id));
    if (followUser.fulfilled.match(res)) {
      setIsFollowing(res.payload.isFollowing);
      dispatch(showSnack({
        message: res.payload.isFollowing ? `Following @${username}!` : `Unfollowed @${username}`,
        severity: 'success',
      }));
    }
    setFollowLoading(false);
  };

  const stats = [
    { label: 'Posts', value: posts.length || MOCK_GRID.length },
    { label: 'Followers', value: profileData?.followers?.length ?? (isOwn ? currentUser?.followers?.length : 0) ?? 0 },
    { label: 'Following', value: profileData?.following?.length ?? (isOwn ? currentUser?.following?.length : 0) ?? 0 },
  ];

  const formatStat = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n;
  };

  if (isLoading && !profileData && !isOwn) {
    return (
      <AppLayout>
        <Box sx={{ maxWidth: 860, mx: 'auto', px: 3, py: 4 }}>
          <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
            <Skeleton variant="circular" width={130} height={130} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width={200} height={30} sx={{ mb: 1 }} />
              <Skeleton width={300} height={20} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map((i) => <Skeleton key={i} width={70} height={50} sx={{ borderRadius: 2 }} />)}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
            {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} variant="rectangular" sx={{ aspectRatio: '1/1', borderRadius: 3 }} />)}
          </Box>
        </Box>
      </AppLayout>
    );
  }

  const displayUser = profileData || currentUser;

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 860, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>

        {/* ── Cover + Profile Card ─────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>

          {/* Cover banner */}
          <Box sx={{
            height: 180,
            borderRadius: '22px',
            background: 'linear-gradient(135deg, #7F0000 0%, #C0392B 35%, #E67E22 65%, #F39C12 100%)',
            position: 'relative',
            overflow: 'hidden',
            mb: '-60px',
          }}>
            {/* Decorative circles */}
            {[1, 2, 3, 4, 5].map((i) => (
              <Box key={i} sx={{
                position: 'absolute',
                borderRadius: '50%',
                border: `1px solid rgba(255,255,255,${0.04 + i * 0.025})`,
                width: `${60 + i * 55}px`, height: `${60 + i * 55}px`,
                top: '50%', left: `${60 + i * 12}%`,
                transform: 'translate(-50%, -50%)',
              }} />
            ))}
            {isOwn && (
              <IconButton
                size="small"
                sx={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.28)', color: '#fff', '&:hover': { background: 'rgba(0,0,0,0.45)' } }}
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
            )}
          </Box>

          {/* White profile card */}
          <Box sx={{
            background: '#fff',
            borderRadius: '22px',
            border: '1px solid rgba(192,57,43,0.07)',
            boxShadow: '0 4px 24px rgba(192,57,43,0.07)',
            pt: '72px', pb: 3, px: { xs: 2.5, md: 4 },
            position: 'relative',
          }}>

            {/* Avatar */}
            <Box sx={{ position: 'absolute', top: -55, left: { xs: 24, md: 36 } }}>
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
                <Box sx={{ p: '3.5px', borderRadius: '50%', background: 'linear-gradient(135deg, #C0392B 0%, #E67E22 60%, #F1C40F 100%)' }}>
                  <Box sx={{ p: '3px', borderRadius: '50%', background: '#fff' }}>
                    <Avatar
                      src={displayUser?.avatar}
                      sx={{ width: 106, height: 106, fontSize: '2.5rem', fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {displayUser?.fullName?.[0]}
                    </Avatar>
                  </Box>
                </Box>
              </motion.div>
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1.5 }}>
              {isOwn ? (
                <>
                  <Button
                    variant="outlined" size="small"
                    startIcon={<Edit sx={{ fontSize: 16 }} />}
                    onClick={() => setEditOpen(true)}
                    sx={{ borderRadius: '50px', fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.82rem' }}
                  >
                    Edit Profile
                  </Button>
                  <IconButton size="small" sx={{ border: '1px solid rgba(192,57,43,0.18)', color: '#aaa', '&:hover': { color: '#C0392B', borderColor: '#C0392B' } }}>
                    <Settings fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant={isFollowing ? 'outlined' : 'contained'}
                      size="small"
                      onClick={handleFollow}
                      disabled={followLoading}
                      startIcon={isFollowing ? <CheckRounded sx={{ fontSize: 16 }} /> : <PersonAdd sx={{ fontSize: 16 }} />}
                      sx={{ borderRadius: '50px', fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.82rem', minWidth: 110 }}
                    >
                      {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </motion.div>
                  <Button
                    variant="outlined" size="small"
                    sx={{ borderRadius: '50px', fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.82rem' }}
                  >
                    Message
                  </Button>
                  <IconButton size="small" sx={{ border: '1px solid rgba(192,57,43,0.18)', color: '#aaa', '&:hover': { color: '#C0392B' } }}>
                    <Share fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Name & username */}
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontSize: '1.65rem', color: '#1C1010', lineHeight: 1.2 }}>
                  {displayUser?.fullName || username}
                </Typography>
                {displayUser?.isVerified && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                    <Verified sx={{ color: '#C0392B', fontSize: 20 }} />
                  </motion.div>
                )}
              </Box>
              <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.85rem', color: '#bbb' }}>
                @{displayUser?.username || username}
              </Typography>
            </Box>

            {/* Bio */}
            {displayUser?.bio && (
              <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.92rem', color: '#444', lineHeight: 1.6, mb: 1.5, maxWidth: 480 }}>
                {displayUser.bio}
              </Typography>
            )}

            {/* Meta info */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2.5 }}>
              {displayUser?.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LinkIcon sx={{ fontSize: 15, color: '#C0392B' }} />
                  <Typography
                    component="a"
                    href={displayUser.website}
                    target="_blank"
                    sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.82rem', color: '#C0392B', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}
                  >
                    {displayUser.website.replace(/^https?:\/\//, '')}
                  </Typography>
                </Box>
              )}
              {displayUser?.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 15, color: '#aaa' }} />
                  <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.82rem', color: '#888' }}>{displayUser.location}</Typography>
                </Box>
              )}
              {displayUser?.createdAt && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarToday sx={{ fontSize: 14, color: '#aaa' }} />
                  <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.82rem', color: '#888' }}>
                    Joined {format(new Date(displayUser.createdAt), 'MMMM yyyy')}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Stats */}
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: { xs: 3, md: 5 } }}>
              {stats.map((s) => (
                <motion.div key={s.label} whileHover={{ scale: 1.06 }} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontSize: '1.55rem', color: '#1C1010', lineHeight: 1 }}>
                    {formatStat(s.value)}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.76rem', color: '#bbb', fontWeight: 600, mt: 0.2 }}>
                    {s.label}
                  </Typography>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* ── Tabs ─────────────────────────────────────────── */}
        <Box sx={{ mt: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              background: '#fff',
              borderRadius: '16px',
              border: '1px solid rgba(192,57,43,0.07)',
              mb: 2.5, px: 1,
              '& .MuiTab-root': {
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 700, textTransform: 'none',
                fontSize: '0.88rem', color: '#bbb',
                '&.Mui-selected': { color: '#C0392B' },
              },
              '& .MuiTabs-indicator': { background: 'linear-gradient(90deg, #C0392B, #E67E22)', height: 3, borderRadius: 2 },
            }}
          >
            <Tab icon={<GridOnRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Posts" />
            <Tab icon={<BookmarkBorderRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Saved" />
            <Tab icon={<FavoriteRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Liked" />
          </Tabs>

          {tab === 0 && <PostGrid posts={posts} />}
          {tab === 1 && (
            isOwn
              ? <PostGrid posts={MOCK_GRID.slice(0, 6)} />
              : (
                <Box sx={{ textAlign: 'center', py: 8, background: '#fff', borderRadius: '18px', border: '1px solid rgba(192,57,43,0.07)' }}>
                  <BookmarkBorderRounded sx={{ fontSize: 48, color: '#eee' }} />
                  <Typography sx={{ fontFamily: '"Nunito", sans-serif', color: '#ccc', mt: 1 }}>Saved posts are private</Typography>
                </Box>
              )
          )}
          {tab === 2 && <PostGrid posts={MOCK_GRID.slice(0, 4)} />}
        </Box>
      </Box>

      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
    </AppLayout>
  );
}
