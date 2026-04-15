'use client';
// src/components/post/PostCard.js
import { useState, useRef, useCallback } from 'react';
import {
  Card, CardHeader, CardContent, CardActions, Avatar, Typography,
  IconButton, Box, Chip, Tooltip, TextField, Collapse, Divider,
  Menu, MenuItem, InputAdornment,
} from '@mui/material';
import {
  FavoriteBorder, Favorite, ChatBubbleOutlineRounded, ShareOutlined,
  BookmarkBorder, Bookmark, MoreHoriz, Send, Verified,
  LocationOn, DeleteOutlineRounded, EditOutlined,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { optimisticToggleLike, likePost, savePost, addComment, deletePost } from '@/store/slices/postSlice';
import { showSnack } from '@/store/slices/uiSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Floating heart particle
function HeartBurst({ x, y, onDone }) {
  return (
    <motion.div
      style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 9999, translateX: '-50%', translateY: '-50%' }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: [0, 1.8, 1.2], y: -70, opacity: [1, 1, 0] }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      onAnimationComplete={onDone}
    >
      <Favorite sx={{ color: '#C0392B', fontSize: 32, filter: 'drop-shadow(0 2px 8px rgba(192,57,43,0.5))' }} />
    </motion.div>
  );
}

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((s) => s.auth);

  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [bursts, setBursts] = useState([]);
  const burstId = useRef(0);
  const likeRef = useRef(null);
  const lastTap = useRef(0);

  const isLiked = user ? (post.likes?.includes(user._id) || post.isLiked || false) : false;
  const isSaved = post.isSaved || false;
  const isOwner = user?._id === post.author?._id;
  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  const spawnBurst = useCallback((e) => {
    const rect = likeRef.current?.getBoundingClientRect?.() || { left: e.clientX, top: e.clientY, width: 0, height: 0 };
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const id = burstId.current++;
    setBursts((prev) => [...prev, { id, x, y }]);
  }, []);

  const handleLike = useCallback((e) => {
    if (!user) return toast.error('Login to like posts');
    // 1. Optimistic update — instant feel
    dispatch(optimisticToggleLike({ postId: post._id, userId: user._id }));
    // 2. Spawn heart burst only when liking (not unliking)
    if (!isLiked) spawnBurst(e);
    // 3. API call in background
    dispatch(likePost(post._id));
  }, [dispatch, isLiked, post._id, user, spawnBurst]);

  // Double-tap image to like
  const handleImageTap = useCallback((e) => {
    const now = Date.now();
    if (now - lastTap.current < 350) {
      if (!isLiked) handleLike(e);
    }
    lastTap.current = now;
  }, [handleLike, isLiked]);

  const handleSave = () => {
    if (!user) return toast.error('Login to save posts');
    dispatch(savePost(post._id));
    dispatch(showSnack({ message: isSaved ? 'Removed from saved' : '✓ Post saved!', severity: 'success' }));
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    if (!user) return toast.error('Login to comment');
    await dispatch(addComment({ postId: post._id, text: commentText.trim() }));
    setCommentText('');
  };

  const handleDelete = async () => {
    await dispatch(deletePost(post._id));
    dispatch(showSnack({ message: 'Post deleted', severity: 'success' }));
    setMenuAnchor(null);
  };

  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : '';

  return (
    <>
      {/* Floating heart bursts */}
      {bursts.map((b) => (
        <HeartBurst
          key={b.id}
          x={b.x}
          y={b.y}
          onDone={() => setBursts((prev) => prev.filter((p) => p.id !== b.id))}
        />
      ))}

      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card
          sx={{
            borderRadius: '18px',
            '&:hover': { boxShadow: '0 8px 28px rgba(192,57,43,0.10)', transform: 'translateY(-2px)' },
            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          }}
        >
          {/* Header */}
          <CardHeader
            avatar={
              <Avatar
                src={post.author?.avatar}
                onClick={() => router.push(`/profile/${post.author?.username}`)}
                sx={{ width: 44, height: 44, cursor: 'pointer', border: '2px solid rgba(192,57,43,0.15)', '&:hover': { borderColor: '#C0392B' }, transition: 'border-color 0.2s', fontSize: '1rem' }}
              >
                {post.author?.fullName?.[0]}
              </Avatar>
            }
            action={
              <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ color: '#bbb' }}>
                <MoreHoriz />
              </IconButton>
            }
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  onClick={() => router.push(`/profile/${post.author?.username}`)}
                  sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.92rem', color: '#1C1010', cursor: 'pointer', '&:hover': { color: '#C0392B' }, transition: 'color 0.18s' }}
                >
                  {post.author?.fullName}
                </Typography>
                {post.author?.isVerified && <Verified sx={{ fontSize: 14, color: '#C0392B' }} />}
              </Box>
            }
            subheader={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', mt: 0.2 }}>
                <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.76rem', color: '#bbb' }}>
                  @{post.author?.username} · {timeAgo}
                </Typography>
                {post.location && (
                  <>
                    <Typography sx={{ color: '#ddd', fontSize: '0.76rem' }}>·</Typography>
                    <LocationOn sx={{ fontSize: 13, color: '#C0392B' }} />
                    <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.76rem', color: '#C0392B', fontWeight: 600 }}>
                      {post.location}
                    </Typography>
                  </>
                )}
              </Box>
            }
            sx={{ pb: 0.5, alignItems: 'flex-start' }}
          />

          {/* Text content */}
          {post.content && (
            <CardContent sx={{ pt: 0.5, pb: 1, px: 2.5 }}>
              <Typography
                sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.93rem', color: '#2C1A1A', lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{
                  __html: post.content.replace(/#(\w+)/g, '<span style="color:#C0392B;font-weight:700">#$1</span>'),
                }}
              />
            </CardContent>
          )}

          {/* Tags */}
          {post.tags?.length > 0 && (
            <Box sx={{ px: 2.5, pb: 1, display: 'flex', gap: 0.6, flexWrap: 'wrap' }}>
              {post.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  sx={{ background: 'rgba(192,57,43,0.07)', color: '#C0392B', fontWeight: 700, height: 22, fontSize: '0.7rem', '&:hover': { background: 'rgba(192,57,43,0.14)' } }}
                />
              ))}
            </Box>
          )}

          {/* Images */}
          {post.images?.length > 0 && (
            <Box
              onClick={handleImageTap}
              sx={{ mx: 2.5, mb: 1.5, borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', userSelect: 'none' }}
            >
              <Box sx={{
                display: 'grid',
                gap: '2px',
                gridTemplateColumns: post.images.length === 1 ? '1fr' : post.images.length === 2 ? '1fr 1fr' : '2fr 1fr',
                borderRadius: '14px', overflow: 'hidden',
              }}>
                {post.images.slice(0, 3).map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      gridRow: post.images.length >= 3 && idx === 0 ? 'span 2' : 'auto',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={img}
                      alt={`post-img-${idx}`}
                      style={{
                        width: '100%',
                        height: post.images.length === 1 ? '420px' : '210px',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    {idx === 2 && post.images.length > 3 && (
                      <Box sx={{ position: 'absolute', inset: 0, background: 'rgba(28,16,16,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ color: '#fff', fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', fontWeight: 700 }}>
                          +{post.images.length - 3}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Like / comment count bar */}
          <Box sx={{ px: 2.5, pb: 0.5, display: 'flex', gap: 2 }}>
            {likeCount > 0 && (
              <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#888' }}>
                {likeCount} {likeCount === 1 ? 'like' : 'likes'}
              </Typography>
            )}
            {commentCount > 0 && (
              <Typography
                onClick={() => setCommentOpen(!commentOpen)}
                sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#bbb', cursor: 'pointer', '&:hover': { color: '#C0392B' } }}
              >
                {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
              </Typography>
            )}
          </Box>

          <Divider sx={{ mx: 2.5 }} />

          {/* Action Buttons */}
          <CardActions sx={{ px: 1.5, py: 0.5, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* ★ LIKE BUTTON */}
              <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
                <IconButton
                  ref={likeRef}
                  onClick={handleLike}
                  size="small"
                  sx={{
                    color: isLiked ? '#C0392B' : '#aaa',
                    p: 1,
                    '&:hover': { background: 'rgba(192,57,43,0.08)', color: '#C0392B' },
                    transition: 'color 0.18s',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isLiked ? 'filled' : 'outline'}
                      initial={{ scale: 0.4, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0.4, rotate: 20 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    >
                      {isLiked
                        ? <Favorite sx={{ fontSize: 22, color: '#C0392B' }} />
                        : <FavoriteBorder sx={{ fontSize: 22 }} />}
                    </motion.div>
                  </AnimatePresence>
                </IconButton>
              </Tooltip>

              <Tooltip title="Comment">
                <IconButton
                  size="small"
                  onClick={() => setCommentOpen(!commentOpen)}
                  sx={{ p: 1, color: commentOpen ? '#C0392B' : '#aaa', '&:hover': { color: '#C0392B' } }}
                >
                  <ChatBubbleOutlineRounded sx={{ fontSize: 21 }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Share">
                <IconButton size="small" sx={{ p: 1, color: '#aaa', '&:hover': { color: '#C0392B' } }}>
                  <ShareOutlined sx={{ fontSize: 21 }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Save */}
            <Tooltip title={isSaved ? 'Unsave' : 'Save'}>
              <IconButton onClick={handleSave} size="small" sx={{ p: 1, color: isSaved ? '#C0392B' : '#aaa', '&:hover': { color: '#C0392B' } }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isSaved ? 'saved' : 'unsaved'}
                    initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    {isSaved ? <Bookmark sx={{ fontSize: 22, color: '#C0392B' }} /> : <BookmarkBorder sx={{ fontSize: 22 }} />}
                  </motion.div>
                </AnimatePresence>
              </IconButton>
            </Tooltip>
          </CardActions>

          {/* Comments */}
          <Collapse in={commentOpen}>
            <Box sx={{ px: 2.5, pb: 2 }}>
              <Divider sx={{ mb: 1.5 }} />

              {/* Comment list */}
              {post.comments?.slice(-4).map((c) => (
                <Box key={c._id} sx={{ display: 'flex', gap: 1.2, mb: 1.2 }}>
                  <Avatar src={c.user?.avatar} sx={{ width: 28, height: 28, fontSize: '0.72rem', flexShrink: 0 }}>
                    {c.user?.fullName?.[0]}
                  </Avatar>
                  <Box sx={{ background: 'rgba(192,57,43,0.04)', borderRadius: '10px', px: 1.5, py: 0.8, flex: 1 }}>
                    <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.78rem', color: '#1C1010' }}>
                      {c.user?.username}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.82rem', color: '#444', mt: 0.2 }}>
                      {c.text}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {/* Add comment input */}
              {user && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                  <Avatar src={user.avatar} sx={{ width: 28, height: 28, fontSize: '0.72rem', flexShrink: 0 }}>
                    {user.fullName?.[0]}
                  </Avatar>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleComment(); } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '50px',
                        fontSize: '0.84rem',
                        fontFamily: '"Nunito", sans-serif',
                        background: 'rgba(192,57,43,0.03)',
                      },
                    }}
                    InputProps={{
                      endAdornment: commentText && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={handleComment} sx={{ color: '#C0392B' }}>
                            <Send sx={{ fontSize: 17 }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              )}
            </Box>
          </Collapse>
        </Card>
      </motion.div>

      {/* Post menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{ sx: { borderRadius: '14px', boxShadow: '0 8px 28px rgba(192,57,43,0.14)', minWidth: 160 } }}
      >
        {isOwner
          ? [
              <MenuItem key="edit" sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.88rem', gap: 1.5, fontWeight: 600 }}>
                <EditOutlined fontSize="small" sx={{ color: '#888' }} /> Edit post
              </MenuItem>,
              <MenuItem key="delete" onClick={handleDelete} sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.88rem', color: '#C0392B', gap: 1.5, fontWeight: 600 }}>
                <DeleteOutlineRounded fontSize="small" /> Delete
              </MenuItem>,
            ]
          : <MenuItem sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.88rem', fontWeight: 600 }}>Report post</MenuItem>
        }
      </Menu>
    </>
  );
}
