export async function POST() {
    const response = Response.json({
      message: "You have been logged out",
    });
  
    response.headers.set(
      "Set-Cookie",
      "token=; Path=/; Max-Age=0"
    );
  
    return response;
  }