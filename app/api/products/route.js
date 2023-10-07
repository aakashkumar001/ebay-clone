import prisma from "@/app/libs/Prisma";
import { NextResponse } from "next/server";


export async function GET() {

  try {
    
   const products = await prisma.products.findMany()

    await prisma.$disconnect();
    return NextResponse.json(products);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    return new NextResponse("something went wrong", { status: 400 });
  }
}
