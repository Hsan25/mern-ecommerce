import { NextRequest, NextResponse } from "next/server";

const POST = async (req: NextRequest) => {
  const body = req.body;
  console.log(body);
  // req.cookies.set('accessToken',)
};

export { POST };
