'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { apiAuth } from '@/lib/api';
import { Loader2, PenSquare, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface PostData {
  id: string;
  content: string;
  imageUrls?: string[];
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // Get the current user's profile which includes recent posts
      const meRes = await apiAuth.withToken(token).get('/user/me');
      const username = meRes.data?.data?.username;

      if (username) {
        const profileRes = await apiAuth.withToken(token).get(`/connect/profiles/${username}`);
        setPosts(profileRes.data?.recentPosts || []);
      }
    } catch (err) {
      console.error('Failed to load my posts', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      await apiAuth.withToken(token).delete(`/connect/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: 'var(--c-400)' }} />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div style={{ background: 'var(--c-800)', border: '1px solid var(--c-700)', borderRadius: 'var(--r-lg)', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: 'var(--c-700)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <PenSquare style={{ width: '28px', height: '28px', color: 'var(--c-400)' }} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--c-100)', marginBottom: '8px' }}>No posts yet</h3>
        <p style={{ fontSize: '14px', color: 'var(--c-400)', maxWidth: '320px', margin: '0 auto 24px' }}>
          You haven&apos;t published any posts yet. Share something with the community!
        </p>
        <Link href="/community" className="btn btn--primary btn--sm">
          Go to Feed
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--c-100)' }}>My Posts</h2>
        <p style={{ fontSize: '13px', color: 'var(--c-400)', marginTop: '4px' }}>Your recent activity on the community feed</p>
      </div>

      {posts.map(post => {
        const displayImage = post.imageUrls?.[0] || post.imageUrl;
        return (
          <article key={post.id} className="feed-post" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div className="feed-post__meta">{new Date(post.createdAt).toLocaleDateString()}</div>
              <button
                onClick={() => handleDelete(post.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--red)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: '4px 8px', borderRadius: 'var(--r-md)' }}
              >
                <Trash2 style={{ width: '14px', height: '14px' }} /> Delete
              </button>
            </div>

            <p className="feed-post__body" style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

            {displayImage && (
              <div style={{ borderRadius: 'var(--r-md)', overflow: 'hidden', marginBottom: '16px', background: 'var(--c-900)', display: 'flex', justifyContent: 'center' }}>
                <img src={displayImage} alt="Post content" style={{ maxWidth: '100%', maxHeight: '384px', objectFit: 'contain' }} />
              </div>
            )}

            <div className="feed-post__actions">
              <span className="feed-post__action">👍 {post.likesCount || 0} Likes</span>
              <span className="feed-post__action">💬 {post.commentsCount || 0} Comments</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
