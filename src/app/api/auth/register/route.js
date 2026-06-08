import connectDB from "@/src/lib/mongodb";
import User from "@/src/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();

  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return Response.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return Response.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return Response.json({
    message: "User created",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}