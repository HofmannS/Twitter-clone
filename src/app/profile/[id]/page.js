"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import TwemojiText from "@/src/components/TwemojiText";

export default function ProfilePage() {
  const params = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  async function fetchProfile() {
    try {
      setLoading(true);
      const res = await axios.get(`/api/users/${params.id}`);
      setData(res.data);
    } catch (err) {
      console.error("Profile error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params?.id) fetchProfile();
  }, [params?.id]);

  async function handleFollow() {
    if (!data) return;
    setFollowLoading(true);
    try {
      const res = await axios.post(`/api/users/${params.id}/follow`);
      setData((prev) => {
        const user = { ...prev.user };
        if (res.data.following) {
          user.followers = [...(user.followers ?? []), data.currentUserId];
        } else {
          user.followers = (user.followers ?? []).filter(
            (f) => f.toString() !== data.currentUserId?.toString()
          );
        }
        return { ...prev, user, isFollowing: res.data.following };
      });
    } catch (err) {
      console.error("Follow error:", err);
    } finally {
      setFollowLoading(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-zinc-500">Loading profile...</div>;
  }

  if (!data) {
    return <div className="p-6 text-red-500">Profile not found</div>;
  }

  const { user, posts, isFollowing, currentUserId } = data;
  const isOwnProfile = currentUserId?.toString() === params.id;

  return (
    <div>
      {/* Header */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700"
            />
            <div>
              <h1 className="text-xl font-bold">@{user.username}</h1>
              <p className="text-zinc-400 text-sm mt-0.5">{user.bio}</p>
              <div className="flex gap-4 mt-2 text-sm text-zinc-500">
                <span>
                  <span className="text-white font-semibold">
                    {user.following?.length ?? 0}
                  </span>{" "}
                  Following
                </span>
                <span>
                  <span className="text-white font-semibold">
                    {user.followers?.length ?? 0}
                  </span>{" "}
                  Followers
                </span>
              </div>
            </div>
          </div>

          {!isOwnProfile && currentUserId && (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-colors disabled:opacity-50 ${
                isFollowing
                  ? "border border-zinc-600 text-white hover:border-red-500 hover:text-red-400"
                  : "bg-yellow-400 text-black hover:bg-yellow-300"
              }`}
            >
              {followLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}

          {isOwnProfile && (
            <Link
              href="/settings"
              className="px-5 py-2 rounded-full border border-zinc-600 text-sm font-bold hover:border-yellow-400 hover:text-yellow-400 transition-colors"
            >
              Edit profile
            </Link>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="divide-y divide-zinc-800">
        {posts.length === 0 ? (
          <p className="p-6 text-zinc-500">No posts yet</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="p-4">
              <TwemojiText text={post.content} className="mt-1" />
              <div className="flex gap-4 mt-3 text-sm text-zinc-500">
                <span className="text-yellow-400">♥ {post.likes?.length ?? 0}</span>
                <span>💬 {post.comments?.length ?? 0}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
