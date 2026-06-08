import connectDB from "@/src/lib/mongodb";
import Post from "@/src/models/Post";
import User from "@/src/models/User";
import { getUser } from "@/src/lib/getUser";

export async function GET(req) {
  await connectDB();

  const url = new URL(req.url);
  const feed = url.searchParams.get("feed");

  let query = {};

  if (feed === "following") {
    const currentUser = await getUser(req);
    if (currentUser) {
      const userDoc = await User.findById(currentUser._id).select("following");
      query = { user: { $in: [...userDoc.following, currentUser._id] } };
    }
  }

  const posts = await Post.find(query)
    .populate("user", "username avatar")
    .populate({ path: "comments.user", select: "username avatar" })
    .sort({ createdAt: -1 });

  return Response.json(posts);
}

export async function POST(req) {
  await connectDB();

  const user = await getUser(req);

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { content } = await req.json();

  if (!content) {
    return Response.json(
      { message: "Content required" },
      { status: 400 }
    );
  }

  const post = await Post.create({
    content,
    user: user._id,
  });

  await post.populate("user", "username avatar");

  return Response.json(post);
}
