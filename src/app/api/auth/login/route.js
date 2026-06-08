import connectDB from "@/src/lib/mongodb";
import User from "@/src/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/src/lib/jwt";

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    return Response.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return Response.json(
      { message: "Incorrect password" },
      { status: 400 }
    );
  }

  const token = signToken({
    id: user._id,
    username: user.username,
  });

  const response = Response.json({
    message: "Login successful",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });

  response.headers.set(
    "Set-Cookie",
    `token=${token}; Path=/; HttpOnly; SameSite=Strict`
  );

  return response;
}