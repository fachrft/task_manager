import { NextResponse } from "next/server"
import { prisma } from "@/utils/prisma"
import { ApiError } from "@/lib/errors"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tasks = await prisma.task.findMany({
      where: {
        userId: id,
      },
    })
    return NextResponse.json(tasks, { status: 200 })
  } catch (error: any) {
    console.error("[GET_TASK_ERROR]:", error)
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}