"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import TextInputWithEmoji from "@/src/components/TextInputWithEmoji";
import TwemojiText from "@/src/components/TwemojiText";

function HeartIcon({ filled }) {
  return filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
    </svg>
  );
}

function PostCard({ post, currentUserId, onDelete, onLike, onComment, onDeleteComment }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLiked = currentUserId
    ? post.likes?.some((l) => l.toString() === currentUserId.toString())
    : false;
  const isOwner = currentUserId && post.user?._id?.toString() === currentUserId.toString();

  async function submitComment() {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await onComment(post._id, commentText.trim());
      setCommentText("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-4 border-b border-zinc-800 hover:bg-zinc-900/40 transition-colors">
      <div className="flex gap-3">
        <Link href={`/profile/${post.user?._id}`} className="shrink-0">
          <img
            src={post.user?.avatar ?? "/avatars/default_avatar.png"}
            alt={post.user?.username}
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/profile/${post.user?._id}`}
              className="font-semibold hover:text-yellow-400 transition-colors truncate"
            >
              @{post.user?.username}
            </Link>
            {isOwner && (
              <button
                onClick={() => onDelete(post._id)}
                className="text-zinc-600 hover:text-red-400 text-xs shrink-0 transition-colors"
              >
                delete
              </button>
            )}
          </div>

          <TwemojiText
            text={post.content}
            className="mt-1 text-[15px] leading-relaxed break-words"
          />

          {/* Actions */}
          <div className="flex gap-5 mt-3">
            <button
              onClick={() => onLike(post._id)}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                isLiked ? "text-red-400" : "text-zinc-500 hover:text-red-400"
              }`}
            >
              <HeartIcon filled={isLiked} />
              <span>{post.likes?.length ?? 0}</span>
            </button>

            <button
              onClick={() => setShowComments((v) => !v)}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-yellow-400 transition-colors"
            >
              <CommentIcon />
              <span>{post.comments?.length ?? 0}</span>
            </button>
          </div>

          {/* Comments section */}
          {showComments && (
            <div className="mt-3 space-y-2">
              {post.comments?.length > 0 && (
                <div className="space-y-2">
                  {post.comments.map((c) => (
                    <div key={c._id} className="flex gap-2 items-start group">
                      <img
                        src={c.user?.avatar ?? "/avatars/default_avatar.png"}
                        alt={c.user?.username}
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="flex-1 bg-zinc-900 rounded-xl px-3 py-2 text-sm">
                        <span className="font-semibold text-yellow-400 mr-1.5">
                          @{c.user?.username}
                        </span>
                        <TwemojiText text={c.text} className="text-zinc-300" inline />
                      </div>
                      {(currentUserId === c.user?._id?.toString() ||
                        currentUserId === post.user?._id?.toString()) && (
                        <button
                          onClick={() => onDeleteComment(post._id, c._id)}
                          className="text-zinc-700 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-all mt-1.5"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {currentUserId && (
                <div className="flex gap-2 mt-2 items-center">
                  <TextInputWithEmoji
                    className="flex-1"
                    value={commentText}
                    onChange={setCommentText}
                    placeholder="Write a comment..."
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && submitComment()}
                  />
                  <button
                    onClick={submitComment}
                    disabled={submitting || !commentText.trim()}
                    className="px-4 py-1.5 bg-yellow-400 text-black text-sm font-bold rounded-full hover:bg-yellow-300 disabled:opacity-40 transition-colors shrink-0"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WhoToFollow({ currentUserId }) {
  const [suggestions, setSuggestions] = useState([]);
  const [followed, setFollowed] = useState({});

  useEffect(() => {
    axios.get("/api/users/suggestions").then((res) => setSuggestions(res.data));
  }, []);

  async function handleFollow(userId) {
    try {
      const res = await axios.post(`/api/users/${userId}/follow`);
      setFollowed((prev) => ({ ...prev, [userId]: res.data.following }));
    } catch {
      // ignore
    }
  }

  if (!suggestions.length) return null;

  return (
    <div className="bg-zinc-900 rounded-2xl p-4">
      <h2 className="font-bold text-lg mb-3">Who to follow</h2>
      <div className="space-y-3">
        {suggestions.map((u) => {
          const isFollowing = followed[u._id] ?? false;
          return (
            <div key={u._id} className="flex items-center gap-3">
              <Link href={`/profile/${u._id}`} className="shrink-0">
                <img
                  src={u.avatar}
                  alt={u.username}
                  className="w-9 h-9 rounded-full object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/profile/${u._id}`}
                  className="font-semibold text-sm hover:text-yellow-400 transition-colors block truncate"
                >
                  @{u.username}
                </Link>
                <p className="text-xs text-zinc-500 truncate">{u.bio}</p>
              </div>
              {currentUserId && currentUserId !== u._id.toString() && (
                <button
                  onClick={() => handleFollow(u._id)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    isFollowing
                      ? "border border-zinc-600 text-zinc-400 hover:border-red-500 hover:text-red-400"
                      : "bg-yellow-400 text-black hover:bg-yellow-300"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [tab, setTab] = useState("foryou");
  const [posting, setPosting] = useState(false);

  async function fetchCurrentUser() {
    const res = await axios.get("/api/auth/me");
    setCurrentUser(res.data);
  }

  const fetchPosts = useCallback(async () => {
    const params = tab === "following" ? "?feed=following" : "";
    const { data } = await axios.get(`/api/posts${params}`);
    setPosts(data);
  }, [tab]);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function createPost() {
    if (!content.trim()) return;
    setPosting(true);
    try {
      await axios.post("/api/posts", { content });
      setContent("");
      fetchPosts();
    } finally {
      setPosting(false);
    }
  }

  async function deletePost(id) {
    await axios.delete(`/api/posts/${id}`);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  }

  async function likePost(id) {
    if (!currentUser) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== id) return p;
        const liked = p.likes?.some((l) => l.toString() === currentUser._id.toString());
        return {
          ...p,
          likes: liked
            ? p.likes.filter((l) => l.toString() !== currentUser._id.toString())
            : [...(p.likes ?? []), currentUser._id],
        };
      })
    );
    try {
      await axios.post(`/api/posts/like/${id}`);
    } catch {
      fetchPosts();
    }
  }

  async function addComment(postId, text) {
    const res = await axios.post(`/api/posts/${postId}/comments`, { text });
    setPosts((prev) => prev.map((p) => (p._id === postId ? res.data : p)));
  }

  async function deleteComment(postId, commentId) {
    const res = await axios.delete(`/api/posts/${postId}/comments/${commentId}`);
    setPosts((prev) => prev.map((p) => (p._id === postId ? res.data : p)));
  }

  return (
    <div className="flex min-h-screen">
      {/* Main feed */}
      <main className="flex-1 border-r border-zinc-800 min-w-0">
        {/* Compose */}
        {currentUser && (
          <div className="p-4 border-b border-zinc-800">
            <div className="flex gap-3">
              <img
                src={currentUser.avatar ?? "/avatars/default_avatar.png"}
                alt="me"
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="flex-1">
                <TextInputWithEmoji
                  multiline
                  rows={2}
                  value={content}
                  onChange={setContent}
                  placeholder="What's happening?"
                  actions={
                    <button
                      onClick={createPost}
                      disabled={posting || !content.trim()}
                      className="bg-yellow-400 text-black px-5 py-2 rounded-full font-bold hover:bg-yellow-300 disabled:opacity-50 transition-colors"
                    >
                      {posting ? "Posting..." : "Post"}
                    </button>
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setTab("foryou")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              tab === "foryou"
                ? "text-white border-b-2 border-yellow-400"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            For you
          </button>
          <button
            onClick={() => setTab("following")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              tab === "following"
                ? "text-white border-b-2 border-yellow-400"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            Following
          </button>
        </div>

        {/* Feed */}
        <div>
          {posts.length === 0 ? (
            <p className="p-6 text-zinc-500 text-center">
              {tab === "following"
                ? "Follow someone to see their posts here."
                : "No posts yet. Be the first!"}
            </p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={currentUser?._id?.toString()}
                onDelete={deletePost}
                onLike={likePost}
                onComment={addComment}
                onDeleteComment={deleteComment}
              />
            ))
          )}
        </div>
      </main>

      {/* Sidebar */}
      <aside className="hidden lg:block w-80 p-4 space-y-4 shrink-0">
        <WhoToFollow currentUserId={currentUser?._id?.toString()} />
      </aside>
    </div>
  );
}
