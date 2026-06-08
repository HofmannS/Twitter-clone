import connectDB from "@/src/lib/mongodb";
import User from "@/src/models/User";
import { getUser } from "@/src/lib/getUser";

export async function POST(req, { params }) {
  await connectDB();

  const { id: targetId } = await params;

  const currentUser = await getUser(req);
  if (!currentUser) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (currentUser._id.toString() === targetId) {
    return Response.json({ message: "Cannot follow yourself" }, { status: 400 });
  }

  const target = await User.findById(targetId);
  if (!target) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  const isFollowing = target.followers
    .map((f) => f.toString())
    .includes(currentUser._id.toString());

  if (isFollowing) {
    await User.findByIdAndUpdate(targetId, {
      $pull: { followers: currentUser._id },
    });
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetId },
    });
    return Response.json({ following: false });
  } else {
    await User.findByIdAndUpdate(targetId, {
      $addToSet: { followers: currentUser._id },
    });
    await User.findByIdAndUpdate(currentUser._id, {
      $addToSet: { following: targetId },
    });
    return Response.json({ following: true });
  }
}
