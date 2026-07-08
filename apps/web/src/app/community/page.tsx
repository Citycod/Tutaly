'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { apiAuth } from '@/lib/api';
import { Send, ImagePlus, X, Link as LinkIcon, Flag, Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import Link from 'next/link';

interface PostData {
  id: string;
  content: string;
  imageUrls?: string[];
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  author: { id: string; firstName?: string; lastName?: string; email: string, avatar?: string, username?: string };
  createdAt: string;
}

const getInitials = (user: any) => {
  if (!user) return 'U';
  if (user.firstName && user.lastName) return `${user.firstName[0]}${user.lastName[0]}`;
  return (user.firstName || user.username || user.email || 'U')[0].toUpperCase();
};

const getAuthorName = (author: any) => {
  if (!author) return 'Loading...';
  if (author.firstName && author.lastName) return `${author.firstName} ${author.lastName}`;
  return author.username || author.email?.split('@')[0] || 'User';
};

const PostItem = ({ post, currentUserId, onDelete, onLike }: { post: PostData, currentUserId: string, onDelete: (id: string) => void, onLike: (id: string) => void }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await apiAuth.withToken(token!).get(`/connect/posts/${post.id}/comments`);
      setComments(res.data?.data || []);
    } catch { }
    setLoadingComments(false);
  };

  const handleToggleComments = () => {
    if (!showComments && comments.length === 0) {
      loadComments();
    }
    setShowComments(!showComments);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem('access_token');
      await apiAuth.withToken(token!).post(`/connect/posts/${post.id}/comments`, { body: newComment });
      setNewComment('');
      loadComments();
    } catch { }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/community/post/${post.id}`);
    setShowMenu(false);
    alert('Link copied!');
  };

  const handleReport = async () => {
    const reason = prompt("Reason for reporting:");
    if (reason) {
      try {
        const token = localStorage.getItem('access_token');
        await apiAuth.withToken(token!).post(`/connect/posts/${post.id}/report`, { reason });
        alert('Post reported.');
      } catch { }
    }
    setShowMenu(false);
  };

  const authorProfileLink = `/community/profile/${post.author.username || post.author.id}`;
  const displayImage = post.imageUrls?.[0] || post.imageUrl;

  return (
    <article className="feed-post reveal visible" style={{ position: 'relative' }}>
      <div className="feed-post__head" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href={authorProfileLink}>
            {post.author.avatar ? (
              <img src={post.author.avatar} alt="avatar" className="feed-post__avatar object-cover" />
            ) : (
              <div className="feed-post__avatar" style={{ background: 'var(--blue)' }}>
                {getInitials(post.author)}
              </div>
            )}
          </Link>
          <div>
            <div className="feed-post__name">
              <Link href={authorProfileLink} style={{ textDecoration: 'none', color: 'inherit' }}>
                {getAuthorName(post.author)}
              </Link>
            </div>
            <div className="feed-post__meta">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowMenu(!showMenu)} style={{ color: 'var(--c-400)', padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <MoreHorizontal className="w-5 h-5" />
          </button>
          {showMenu && (
            <div style={{ position: 'absolute', right: 0, marginTop: '8px', width: '192px', background: 'var(--c-800)', borderRadius: 'var(--r-md)', border: '1px solid var(--c-700)', padding: '4px 0', zIndex: 10 }}>
              <button onClick={handleCopyLink} style={{ width: '100%', textAlign: 'left', padding: '8px 16px', fontSize: '13px', color: 'var(--c-200)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LinkIcon className="w-4 h-4" /> Copy Link
              </button>
              {post.author.id === currentUserId ? (
                <button onClick={() => { onDelete(post.id); setShowMenu(false); }} style={{ width: '100%', textAlign: 'left', padding: '8px 16px', fontSize: '13px', color: 'var(--red)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trash2 className="w-4 h-4" /> Delete Post
                </button>
              ) : (
                <button onClick={handleReport} style={{ width: '100%', textAlign: 'left', padding: '8px 16px', fontSize: '13px', color: 'var(--c-200)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flag className="w-4 h-4" /> Report Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="feed-post__body" style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

      {displayImage && (
        <div style={{ borderRadius: 'var(--r-md)', overflow: 'hidden', marginBottom: '16px', background: 'var(--c-900)', display: 'flex', justifyContent: 'center' }}>
          <img src={displayImage} alt="Post content" style={{ maxWidth: '100%', maxHeight: '384px', objectFit: 'contain' }} />
        </div>
      )}

      <div className="feed-post__actions">
        <span className="feed-post__action" onClick={() => onLike(post.id)}>
          👍 {post.likesCount || 0} Likes
        </span>
        <span className="feed-post__action" onClick={handleToggleComments}>
          💬 {post.commentsCount || 0} Comments
        </span>
        <span className="feed-post__action" onClick={handleCopyLink}>
          ↗ Share
        </span>
      </div>

      {showComments && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--c-700)' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input 
              type="text" 
              value={newComment} 
              onChange={e => setNewComment(e.target.value)} 
              placeholder="Write a comment..." 
              style={{ flex: 1, background: 'var(--c-700)', border: '1px solid var(--c-600)', borderRadius: 'var(--r-md)', padding: '8px 12px', fontSize: '13px', color: 'var(--c-100)', outline: 'none' }}
              onKeyDown={e => e.key === 'Enter' && handlePostComment()}
            />
            <button onClick={handlePostComment} disabled={!newComment.trim()} style={{ background: 'var(--blue)', color: 'var(--c-100)', border: 'none', borderRadius: 'var(--r-md)', padding: '0 16px', fontSize: '13px', fontWeight: 600, cursor: newComment.trim() ? 'pointer' : 'not-allowed', opacity: newComment.trim() ? 1 : 0.5 }}>
              Post
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loadingComments ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}><Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite', color: 'var(--c-400)', margin: '0 auto' }} /></div>
            ) : comments.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--c-500)', textAlign: 'center', padding: '8px 0' }}>No comments yet. Be the first!</p>
            ) : (
              comments.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--c-600)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--c-300)', fontSize: '12px' }}>
                    {c.author?.avatar ? <img src={c.author.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : getAuthorName(c.author)[0].toUpperCase()}
                  </div>
                  <div style={{ background: 'var(--c-700)', borderRadius: 'var(--r-md)', padding: '10px 14px', flex: 1 }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--c-100)', marginBottom: '4px' }}>{getAuthorName(c.author)}</p>
                    <p style={{ fontSize: '13px', color: 'var(--c-200)' }}>{c.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default function FeedPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFeed = useCallback(async (pageNum: number, overwrite: boolean = false) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const res = await apiAuth.withToken(token).get(`/connect/feed?page=${pageNum}&limit=10`);
      const newPosts = res.data?.data || [];
      if (newPosts.length < 10) setHasMore(false);
      
      setPosts(prev => overwrite ? newPosts : [...prev, ...newPosts]);
    } catch (err) {
      console.error('Failed to load feed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      apiAuth.withToken(token).get('/user/me').then(res => {
        setCurrentUserId(res.data?.data?.id || '');
        setCurrentUser(res.data?.data);
      }).catch(() => {});
    }
    fetchFeed(1, true);
  }, [fetchFeed]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(nextPage, false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() && !imageFile) return;
    setPosting(true);
    setPostError('');
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      let uploadedUrl = null;
      if (imageFile) {
        try {
          uploadedUrl = await uploadToCloudinary(imageFile);
        } catch (uploadErr: any) {
          throw new Error('Image upload failed: ' + uploadErr.message);
        }
      }

      await apiAuth.withToken(token).post('/connect/posts', { 
        content: newPost,
        imageUrls: uploadedUrl ? [uploadedUrl] : undefined
      });
      
      setNewPost('');
      removeImage();
      setPage(1);
      setHasMore(true);
      fetchFeed(1, true);
    } catch (e) {
      const err = e as { response?: { data?: { message?: string }; status?: number }; message?: string };
      console.error('Failed to create post', err);
      setPostError(err?.message || err?.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      await apiAuth.withToken(token).post(`/connect/posts/${postId}/like`);
      setPosts(posts.map(p => p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p));
      fetchFeed(1, true);
    } catch (err) {}
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      await apiAuth.withToken(token).delete(`/connect/posts/${postId}`);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {}
  };

  return (
    <div>
      <div className="composer">
        <div className="composer__row">
          {currentUser?.avatar ? (
            <img src={currentUser.avatar} alt="avatar" className="composer__avatar object-cover" />
          ) : (
            <div className="composer__avatar" style={{ background: 'var(--blue)' }}>
              {getInitials(currentUser)}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <textarea
              className="composer__input"
              style={{ width: '100%', minHeight: '80px', resize: 'none' }}
              placeholder="Share an update, ask a question, or celebrate a win..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            
            {imagePreview && (
              <div style={{ position: 'relative', marginTop: '12px', display: 'inline-block' }}>
                <img src={imagePreview} alt="Preview" style={{ height: '120px', borderRadius: 'var(--r-md)', objectFit: 'cover' }} />
                <button
                  onClick={removeImage}
                  style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--c-800)', color: 'var(--c-200)', border: '1px solid var(--c-600)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {postError && (
              <p style={{ color: 'var(--red)', fontSize: '13px', marginTop: '8px' }}>{postError}</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--c-400)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                >
                  <ImagePlus className="w-4 h-4" /> Photo
                </button>
              </div>

              <button
                onClick={handleCreatePost}
                disabled={posting || (!newPost.trim() && !imageFile)}
                className="btn btn--primary btn--sm"
                style={{ opacity: posting || (!newPost.trim() && !imageFile) ? 0.5 : 1 }}
              >
                {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="feed-posts">
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: 'var(--c-400)', margin: '0 auto' }} />
          </div>
        ) : posts.length === 0 ? (
          <div style={{ background: 'var(--c-800)', border: '1px solid var(--c-700)', borderRadius: 'var(--r-lg)', padding: '40px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--c-100)', marginBottom: '8px' }}>No posts yet</h3>
            <p style={{ fontSize: '14px', color: 'var(--c-400)' }}>Be the first to share something with the community!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostItem 
              key={post.id} 
              post={post} 
              currentUserId={currentUserId} 
              onDelete={handleDeletePost}
              onLike={handleLike}
            />
          ))
        )}

        {posts.length > 0 && hasMore && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={loadMore}
              className="btn btn--ghost btn--sm"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
