import connectDB from "@/src/lib/mongodb";
import { getUser } from "@/src/lib/getUser";
import Image from "@/src/models/Image";
import User from "@/src/models/User";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req) {
  await connectDB();

  const user = await getUser(req);
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("avatar");

  if (!file || typeof file === "string") {
    return Response.json({ message: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json(
      { message: "Only JPEG, PNG, GIF, WEBP images are allowed" },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.byteLength > MAX_SIZE_BYTES) {
    return Response.json(
      { message: "File too large. Max size is 5 MB" },
      { status: 400 }
    );
  }

  const image = await Image.create({
    data: buffer,
    contentType: file.type,
  });

  await User.findByIdAndUpdate(user._id, {
    avatar: `/api/images/${image._id}`,
  });

  return Response.json({ avatarUrl: `/api/images/${image._id}` });
}
