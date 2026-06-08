import connectDB from "@/src/lib/mongodb";
import Image from "@/src/models/Image";

export async function GET(req, { params }) {
  await connectDB();

  const { id } = await params;

  const image = await Image.findById(id);

  if (!image) {
    return new Response("Image not found", { status: 404 });
  }

  return new Response(image.data, {
    status: 200,
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
