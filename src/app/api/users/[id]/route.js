import connectDB from "@/src/lib/mongodb";
import User from "@/src/models/User";
import Post from "@/src/models/Post";
import { getUser } from "@/src/lib/getUser";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const currentUser = await getUser(req);

    const user = await User.findById(id).select("-password");

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const posts = await Post.find({ user: id })
      .populate("user", "username avatar")
      .populate({ path: "comments.user", select: "username avatar" })
      .sort({ createdAt: -1 });

    const isFollowing = currentUser
      ? user.followers.map((f) => f.toString()).includes(currentUser._id.toString())
      : false;

    return Response.json({
      user,
      posts,
      isFollowing,
      currentUserId: currentUser?._id ?? null,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
