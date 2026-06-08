import connectDB from "@/src/lib/mongodb";
import Post from "@/src/models/Post";
import { getUser } from "@/src/lib/getUser";

export async function DELETE(req, { params }) {
  await connectDB();

  const { id, commentId } = await params;
  const user = await getUser(req);

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const post = await Post.findById(id);

  if (!post) {
    return Response.json({ message: "Post not found" }, { status: 404 });
  }

  const comment = post.comments.id(commentId);

  if (!comment) {
    return Response.json({ message: "Comment not found" }, { status: 404 });
  }

  const isCommentOwner = comment.user.toString() === user._id.toString();
  const isPostOwner = post.user.toString() === user._id.toString();

  if (!isCommentOwner && !isPostOwner) {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  comment.deleteOne();
  await post.save();

  await post.populate("user", "username avatar");
  await post.populate({ path: "comments.user", select: "username avatar" });

  return Response.json(post);
}
