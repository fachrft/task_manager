import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { ApiError } from "@/lib/errors"
import { prisma } from "@/utils/prisma"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new ApiError("Unauthorized", 401)
    }

    const userId = user.id

    const tasks = await prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
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