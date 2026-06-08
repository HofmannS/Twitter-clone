import connectDB from "@/src/lib/mongodb";
import Post from "@/src/models/Post";
import { getUser } from "@/src/lib/getUser";

export async function DELETE(req, context) {
  await connectDB();

  const { id } = await context.params;

  const user = await getUser(req);

  if (!user) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const post = await Post.findById(id);

  if (!post) {
    return Response.json(
      { message: "Post not found" },
      { status: 404 }
    );
  }

  if (post.user.toString() !== user._id.toString()) {
    return Response.json(
      { message: "Forbidden" },
      { status: 403 }
    );
  }

  await post.deleteOne();

  return Response.json({ message: "Deleted" });
}