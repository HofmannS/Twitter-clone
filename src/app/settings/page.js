"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const fileRef = useRef(null);

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios.get("/api/auth/me").then((res) => {
      if (!res.data) {
        router.push("/auth/login");
        return;
      }
      setUser(res.data);
      setUsername(res.data.username);
      setBio(res.data.bio ?? "");
    });
  }, [router]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleAvatarUpload() {
    if (!selectedFile) return;
    setUploadingAvatar(true);
    try {
      const form = new FormData();
      form.append("avatar", selectedFile);
      const res = await axios.post("/api/upload/avatar", form);
      setUser((prev) => ({ ...prev, avatar: res.data.avatarUrl }));
      setPreview(null);
      setSelectedFile(null);
      setMessage({ type: "success", text: "Avatar updated!" });
    } catch {
      setMessage({ type: "error", text: "Failed to upload avatar." });
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const res = await axios.patch("/api/auth/me", { username, bio });
      setUser(res.data);
      setMessage({ type: "success", text: "Profile saved!" });
    } catch (err) {
      const msg = err.response?.data?.message ?? "Failed to save profile.";
      setMessage({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return <div className="p-6 text-zinc-500">Loading...</div>;
  }

  const avatarSrc = preview ?? user.avatar;

  return (
    <div className="max-w-lg mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-green-900/40 text-green-400 border border-green-800"
              : "bg-red-900/40 text-red-400 border border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Avatar section */}
      <div className="border border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-zinc-300">Profile picture</h2>
        <div className="flex items-center gap-5">
          <img
            src={avatarSrc}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-zinc-700"
          />
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 rounded-full border border-zinc-600 text-sm hover:border-yellow-400 hover:text-yellow-400 transition-colors"
            >
              Choose image
            </button>
            {selectedFile && (
              <button
                onClick={handleAvatarUpload}
                disabled={uploadingAvatar}
                className="px-4 py-2 rounded-full bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-300 disabled:opacity-50 transition-colors"
              >
                {uploadingAvatar ? "Uploading..." : "Upload avatar"}
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-zinc-600">Accepted: JPEG, PNG, GIF, WEBP — max 5 MB</p>
      </div>

      {/* Profile info section */}
      <div className="border border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-zinc-300">Profile info</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wide">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wide">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="mt-1 w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 resize-none focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="px-6 py-2.5 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}
