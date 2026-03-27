import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { ApiError } from "@/lib/errors"
import { prisma } from "@/utils/prisma"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new ApiError("Unauthorized", 401)
    }

    const userId = user.id

    const body = await request.json()
    const { title, description } = body

    if (!title) {
      throw new ApiError("Title is required", 400)
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId
      },
    })

    return NextResponse.json(
      { message: "Task created successfully", data: task },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("[TASK_ERROR]:", error)
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

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
      take: 10,
    })

    return NextResponse.json(tasks, { status: 200 })
  } catch (error: any) {
    console.error("[TASK_ERROR]:", error)
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

