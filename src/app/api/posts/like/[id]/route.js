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

  const post = await Post.findById(id);

  if (!post) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  const alreadyLiked = post.likes.includes(user._id);

  if (alreadyLiked) {
    post.likes = post.likes.filter(
      (id) => id.toString() !== user._id.toString()
    );
  } else {
    post.likes.push(user._id);
  }

  await post.save();

  return Response.json(post);
}