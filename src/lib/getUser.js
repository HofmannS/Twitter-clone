import { verifyToken } from "./jwt";
import User from "@/src/models/User";

export async function getUser(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) return null;

    const decoded = verifyToken(token);

    if (!decoded) return null;

    const user = await User.findById(decoded.id).select("-password");

    return user;
  } catch (err) {
    return null;
  }
}