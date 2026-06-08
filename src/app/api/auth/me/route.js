import connectDB from "@/src/lib/mongodb";
import { getUser } from "@/src/lib/getUser";
import User from "@/src/models/User";

export async function GET(req) {
  await connectDB();

  const user = await getUser(req);

  if (!user) {
    return Response.json(null);
  }

  return Response.json(user);
}

export async function PATCH(req) {
  await connectDB();

  const user = await getUser(req);

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { bio, username } = await req.json();

  const updates = {};
  if (bio !== undefined) updates.bio = bio.trim();
  if (username !== undefined) {
    const trimmed = username.trim();
    if (!trimmed) {
      return Response.json({ message: "Username cannot be empty" }, { status: 400 });
    }
    const existing = await User.findOne({ username: trimmed, _id: { $ne: user._id } });
    if (existing) {
      return Response.json({ message: "Username already taken" }, { status: 409 });
    }
    updates.username = trimmed;
  }

  const updated = await User.findByIdAndUpdate(user._id, updates, {
    new: true,
  }).select("-password");

  return Response.json(updated);
}
