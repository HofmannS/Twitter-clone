import connectDB from "@/src/lib/mongodb";
import Post from "@/src/models/Post";
import { getUser } from "@/src/lib/getUser";

export async function POST(req, { params }) {
  await connectDB();

  const { id } = await params;
  const user = await getUser(req);

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { text } = await req.json();

  if (!text?.trim()) {
    return Response.json({ message: "Comment text required" }, { status: 400 });
  }

  const post = await Post.findById(id);

  if (!post) {
    return Response.json({ message: "Post not found" }, { status: 404 });
  }

  post.comments.push({ user: user._id, text: text.trim() });
  await post.save();

  await post.populate("user", "username avatar");
  await post.populate({ path: "comments.user", select: "username avatar" });

  return Response.json(post);
}
