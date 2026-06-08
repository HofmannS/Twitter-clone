import connectDB from "@/src/lib/mongodb";
import User from "@/src/models/User";
import { getUser } from "@/src/lib/getUser";

export async function GET(req) {
  await connectDB();

  const currentUser = await getUser(req);

  let excludeIds = [];

  if (currentUser) {
    excludeIds = [
      currentUser._id,
      ...currentUser.following.map((id) => id),
    ];
  }

  const suggestions = await User.find({
    _id: { $nin: excludeIds },
  })
    .select("username avatar bio followers")
    .limit(5);

  return Response.json(suggestions);
}
