'use client';
// src/components/post/CreatePostModal.js
import Tooltip from '@mui/material/Tooltip';
import { useState, useCallback } from 'react';
import {
  Dialog, DialogContent, Box, Typography, Avatar, TextField,
  Button, IconButton, Chip, LinearProgress, Divider, Collapse,
} from '@mui/material';
import { Close, Image, LocationOn, Tag, EmojiEmotions } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '@/store/slices/postSlice';
import { showSnack } from '@/store/slices/uiSlice';
import { useDropzone } from 'react-dropzone';

export default function CreatePostModal({ open, onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { isCreating } = useSelector((s) => s.posts);

  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [location, setLocation] = useState('');
  const [showLocation, setShowLocation] = useState(false);
  const [showTags, setShowTags] = useState(false);

  const onDrop = useCallback((accepted) => {
    accepted.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => setImages((prev) => [...prev, e.target.result]);
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 4 });

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      const tag = tagInput.trim().replace('#', '');
      if (!tags.includes(tag)) setTags((p) => [...p, tag]);
      setTagInput('');
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) return;
    const result = await dispatch(createPost({ content, images, tags, location }));
    if (createPost.fulfilled.match(result)) {
      dispatch(showSnack({ message: '✓ Post shared!', severity: 'success' }));
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setContent(''); setImages([]); setTags([]); setTagInput('');
    setLocation(''); setShowLocation(false); setShowTags(false);
    onClose();
  };

  const charLimit = 2200;

  return (
    <Dialog open={open} onClose={resetAndClose} maxWidth="sm" fullWidth>
      {isCreating && (
        <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, '& .MuiLinearProgress-bar': { background: '#C0392B' } }} />
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.5, borderBottom: '1px solid rgba(192,57,43,0.07)' }}>
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontSize: '1.3rem', color: '#1C1010' }}>
          Create a Post
        </Typography>
        <IconButton size="small" onClick={resetAndClose} sx={{ color: '#bbb' }}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {/* Author row */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, alignItems: 'center' }}>
          <Avatar src={user?.avatar} sx={{ width: 46, height: 46, border: '2px solid rgba(192,57,43,0.18)', fontSize: '1.1rem' }}>
            {user?.fullName?.[0]}
          </Avatar>
          <Box>
            <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.92rem', color: '#1C1010', lineHeight: 1.2 }}>
              {user?.fullName}
            </Typography>
            <Chip label="Public" size="small" sx={{ mt: 0.4, height: 19, fontSize: '0.68rem', background: 'rgba(192,57,43,0.08)', color: '#C0392B', fontWeight: 700 }} />
          </Box>
        </Box>

        {/* Text area */}
        <TextField
          multiline
          minRows={3}
          maxRows={7}
          fullWidth
          placeholder={`What's on your mind, ${user?.fullName?.split(' ')[0] || ''}?`}
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, charLimit))}
          variant="standard"
          InputProps={{ disableUnderline: true }}
          sx={{
            mb: 1,
            '& .MuiInputBase-root': { fontFamily: '"Nunito", sans-serif', fontSize: '1rem', color: '#2C1A1A', lineHeight: 1.6 },
            '& textarea::placeholder': { color: '#ccc' },
          }}
        />
        <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.72rem', color: content.length > charLimit * 0.9 ? '#C0392B' : '#ddd', textAlign: 'right', mb: 1 }}>
          {content.length}/{charLimit}
        </Typography>

        {/* Image previews */}
        <AnimatePresence>
          {images.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: images.length === 1 ? '1fr' : '1fr 1fr', gap: 1, mb: 2, borderRadius: '14px', overflow: 'hidden' }}>
                {images.map((img, idx) => (
                  <Box key={idx} sx={{ position: 'relative' }}>
                    <img src={img} alt={`preview-${idx}`} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                    <IconButton
                      size="small"
                      onClick={() => setImages((p) => p.filter((_, i) => i !== idx))}
                      sx={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.55)', color: '#fff', p: 0.3, '&:hover': { background: 'rgba(192,57,43,0.85)' } }}
                    >
                      <Close sx={{ fontSize: 13 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dropzone */}
        {images.length < 4 && (
          <Box
            {...getRootProps()}
            sx={{
              border: `2px dashed ${isDragActive ? '#C0392B' : 'rgba(192,57,43,0.18)'}`,
              borderRadius: '13px', p: 2, textAlign: 'center', cursor: 'pointer',
              background: isDragActive ? 'rgba(192,57,43,0.04)' : 'transparent',
              transition: 'all 0.2s',
              '&:hover': { borderColor: '#C0392B', background: 'rgba(192,57,43,0.03)' },
              mb: 2,
            }}
          >
            <input {...getInputProps()} />
            <Image sx={{ color: isDragActive ? '#C0392B' : '#ddd', fontSize: 28, mb: 0.5 }} />
            <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.8rem', color: '#bbb' }}>
              {isDragActive ? 'Drop images here' : 'Drag & drop or click to add photos'}
            </Typography>
          </Box>
        )}

        {/* Location */}
        <Collapse in={showLocation}>
          <TextField
            fullWidth size="small" placeholder="Add location..."
            value={location} onChange={(e) => setLocation(e.target.value)}
            sx={{ mb: 1.5 }}
            InputProps={{ startAdornment: <LocationOn sx={{ color: '#C0392B', mr: 1, fontSize: 18 }} /> }}
          />
        </Collapse>

        {/* Tags */}
        <Collapse in={showTags}>
          <Box sx={{ mb: 1.5 }}>
            <TextField
              fullWidth size="small" placeholder="Add tags (press Enter)..."
              value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag}
              InputProps={{ startAdornment: <Tag sx={{ color: '#C0392B', mr: 1, fontSize: 18 }} /> }}
            />
            {tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap', mt: 1 }}>
                {tags.map((t) => (
                  <Chip key={t} label={`#${t}`} size="small" onDelete={() => setTags((p) => p.filter((x) => x !== t))} sx={{ background: 'rgba(192,57,43,0.08)', color: '#C0392B', fontWeight: 700 }} />
                ))}
              </Box>
            )}
          </Box>
        </Collapse>

        <Divider sx={{ my: 1.5 }} />

        {/* Bottom bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Add location">
              <IconButton size="small" onClick={() => setShowLocation(!showLocation)} sx={{ color: showLocation ? '#C0392B' : '#ccc' }}>
                <LocationOn fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add tags">
              <IconButton size="small" onClick={() => setShowTags(!showTags)} sx={{ color: showTags ? '#C0392B' : '#ccc' }}>
                <Tag fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="text" onClick={resetAndClose} sx={{ fontFamily: '"Nunito", sans-serif' }}>Cancel</Button>
            <Button
              variant="contained"
              disabled={(!content.trim() && images.length === 0) || isCreating}
              onClick={handleSubmit}
              sx={{ px: 3, fontFamily: '"Nunito", sans-serif', fontWeight: 700 }}
            >
              {isCreating ? 'Posting...' : 'Share'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
