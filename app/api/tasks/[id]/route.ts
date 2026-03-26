import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { ApiError } from "@/lib/errors"
import { prisma } from "@/utils/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    })

    if (!task) {
      throw new ApiError("Task not found", 404)
    }

    return NextResponse.json(task, { status: 200 })
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new ApiError("Unauthorized", 401)
    }

    const { id } = await params

    const body = await request.json()
    const { title, description, isCompleted } = body

    const task = await prisma.task.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        title,
        description,
        is_completed: isCompleted,
      },
    })

    if (!task) {
      throw new ApiError("Task not found", 404)
    }

    return NextResponse.json(task, { status: 200 })
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new ApiError("Unauthorized", 401)
    }

    const { id } = await params

    const task = await prisma.task.delete({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!task) {
      throw new ApiError("Task not found", 404)
    }

    return NextResponse.json(task, { status: 200 })
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
