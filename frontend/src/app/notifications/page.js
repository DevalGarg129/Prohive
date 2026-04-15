'use client';
// src/app/notifications/page.js
import { useEffect } from 'react';
import { Box, Typography, Avatar, Button, Divider, Chip, CircularProgress } from '@mui/material';
import { Favorite, ChatBubble, PersonAdd, Bookmark, DoneAll } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAllRead } from '@/store/slices/notificationSlice';
import AppLayout from '@/components/layout/AppLayout';

const ICON_MAP = {
  like: { icon: Favorite, color: '#C0392B', bg: 'rgba(192,57,43,0.1)' },
  comment: { icon: ChatBubble, color: '#E67E22', bg: 'rgba(230,126,34,0.1)' },
  follow: { icon: PersonAdd, color: '#27AE60', bg: 'rgba(39,174,96,0.1)' },
  save: { icon: Bookmark, color: '#8E44AD', bg: 'rgba(142,68,173,0.1)' },
};

const TEXT_MAP = {
  like: 'liked your post',
  comment: 'commented on your post',
  follow: 'started following you',
  save: 'saved your post',
};

// Demo notifications
const DEMO_NOTIFS = [
  { _id: 'n1', type: 'like', from: { username: 'maya_ui', fullName: 'Maya Chen', avatar: 'https://i.pravatar.cc/150?u=maya_ui' }, isRead: false, createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(), post: { images: ['https://picsum.photos/60/60?random=301'] } },
  { _id: 'n2', type: 'follow', from: { username: 'arjun_dev', fullName: 'Arjun Patel', avatar: 'https://i.pravatar.cc/150?u=arjun_dev' }, isRead: false, createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString() },
  { _id: 'n3', type: 'comment', from: { username: 'sophie_lens', fullName: 'Sophie Brown', avatar: 'https://i.pravatar.cc/150?u=sophie_lens' }, isRead: false, createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), post: { images: ['https://picsum.photos/60/60?random=302'] } },
  { _id: 'n4', type: 'save', from: { username: 'raj_startup', fullName: 'Raj Kumar', avatar: 'https://i.pravatar.cc/150?u=raj_startup' }, isRead: true, createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), post: { images: ['https://picsum.photos/60/60?random=303'] } },
  { _id: 'n5', type: 'like', from: { username: 'zoe_brand', fullName: 'Zoe Williams', avatar: 'https://i.pravatar.cc/150?u=zoe_brand' }, isRead: true, createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), post: { images: ['https://picsum.photos/60/60?random=304'] } },
  { _id: 'n6', type: 'follow', from: { username: 'alex_code', fullName: 'Alex Morgan', avatar: 'https://i.pravatar.cc/150?u=alex_code' }, isRead: true, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: 'n7', type: 'comment', from: { username: 'nina_v', fullName: 'Nina Varma', avatar: 'https://i.pravatar.cc/150?u=nina_v' }, isRead: true, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), post: { images: ['https://picsum.photos/60/60?random=305'] } },
];

function NotifItem({ notif, isLast }) {
  const meta = ICON_MAP[notif.type] || ICON_MAP.like;
  const IconComp = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: 'rgba(192,57,43,0.015)' }}
    >
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 2,
        px: 2.5, py: 1.8,
        background: !notif.isRead ? 'rgba(192,57,43,0.025)' : 'transparent',
        cursor: 'pointer',
        transition: 'background 0.18s',
      }}>
        {/* Avatar + type icon */}
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <Avatar
            src={notif.from.avatar}
            sx={{ width: 46, height: 46, border: !notif.isRead ? '2px solid rgba(192,57,43,0.25)' : 'none', fontSize: '0.9rem' }}
          >
            {notif.from.fullName[0]}
          </Avatar>
          <Box sx={{
            position: 'absolute', bottom: -2, right: -2,
            background: meta.bg, borderRadius: '50%',
            width: 22, height: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #fff',
          }}>
            <IconComp sx={{ fontSize: 11, color: meta.color }} />
          </Box>
        </Box>

        {/* Text */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.87rem', color: '#2C1A1A', lineHeight: 1.4 }}>
            <Box component="span" sx={{ fontWeight: 800 }}>{notif.from.username}</Box>
            {' '}{TEXT_MAP[notif.type] || 'interacted with you'}
          </Typography>
          <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.74rem', color: '#ccc', mt: 0.3 }}>
            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
          </Typography>
        </Box>

        {/* Post thumbnail */}
        {notif.post?.images?.[0] && (
          <img
            src={notif.post.images[0]}
            alt="post"
            style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: '10px', flexShrink: 0, border: '1px solid rgba(192,57,43,0.08)' }}
          />
        )}

        {/* Unread indicator */}
        {!notif.isRead && (
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#C0392B', flexShrink: 0, boxShadow: '0 0 6px rgba(192,57,43,0.5)' }} />
        )}
      </Box>
      {!isLast && <Divider sx={{ mx: 2.5 }} />}
    </motion.div>
  );
}

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { list, unread, isLoading } = useSelector((s) => s.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Use demo if empty
  const notifications = list.length > 0 ? list : DEMO_NOTIFS;
  const newNotifs = notifications.filter((n) => !n.isRead);
  const oldNotifs = notifications.filter((n) => n.isRead);

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 660, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontSize: '2rem', color: '#1C1010' }}>
                Notifications
              </Typography>
              {newNotifs.length > 0 && (
                <Chip
                  label={`${newNotifs.length} new`}
                  size="small"
                  sx={{ mt: 0.5, background: 'rgba(192,57,43,0.1)', color: '#C0392B', fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.72rem' }}
                />
              )}
            </Box>
            {newNotifs.length > 0 && (
              <Button
                startIcon={<DoneAll sx={{ fontSize: 17 }} />}
                size="small"
                onClick={() => dispatch(markAllRead())}
                sx={{ color: '#C0392B', fontFamily: '"Nunito", sans-serif', fontWeight: 700, '&:hover': { background: 'rgba(192,57,43,0.06)' } }}
              >
                Mark all read
              </Button>
            )}
          </Box>
        </motion.div>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>
            <CircularProgress sx={{ color: '#C0392B' }} />
          </Box>
        ) : (
          <>
            {/* New notifications */}
            {newNotifs.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.75rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1, px: 0.5 }}>
                  New
                </Typography>
                <Box sx={{ background: '#fff', borderRadius: '18px', border: '1px solid rgba(192,57,43,0.07)', overflow: 'hidden', boxShadow: '0 2px 14px rgba(192,57,43,0.04)' }}>
                  {newNotifs.map((n, idx) => (
                    <NotifItem key={n._id} notif={n} isLast={idx === newNotifs.length - 1} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Earlier */}
            {oldNotifs.length > 0 && (
              <Box>
                <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.75rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1, px: 0.5 }}>
                  Earlier
                </Typography>
                <Box sx={{ background: '#fff', borderRadius: '18px', border: '1px solid rgba(192,57,43,0.07)', overflow: 'hidden', boxShadow: '0 2px 14px rgba(192,57,43,0.04)' }}>
                  {oldNotifs.map((n, idx) => (
                    <NotifItem key={n._id} notif={n} isLast={idx === oldNotifs.length - 1} />
                  ))}
                </Box>
              </Box>
            )}

            {notifications.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography sx={{ fontSize: 48, mb: 1 }}>🔔</Typography>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', fontWeight: 600, color: '#1C1010', mb: 0.5 }}>No notifications yet</Typography>
                <Typography sx={{ fontFamily: '"Nunito", sans-serif', color: '#bbb', fontSize: '0.9rem' }}>When people like or comment your posts, you'll see them here.</Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}
