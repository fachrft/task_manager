import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { prisma } from "@/utils/prisma"
import { ApiError } from "@/lib/errors"
import { registerSchema } from "@/lib/validator"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    if (!user) {
      throw new ApiError("User not found", 404)
    }
    return NextResponse.json(user, { status: 200 })
  } catch (error: any) {
    console.error("[GET_USER_ERROR]:", error)
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
    const { id } = await params
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new ApiError("Unauthorized", 401)
    }

    if (user.id !== id) {
      throw new ApiError("Forbidden: You can only update your own profile", 403)
    }

    const body = await request.json()
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      throw new ApiError(validation.error.issues[0].message, 400)
    }

    const { name, email } = validation.data
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
      },
    })

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error: any) {
    console.error("[PUT_USER_ERROR]:", error)
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
    const { id } = await params
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new ApiError("Unauthorized", 401)
    }
    if (user.id !== id) {
      throw new ApiError("Forbidden: You can only delete your own account", 403)
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    })
    await supabase.auth.signOut();

    return NextResponse.json(deletedUser, { status: 200 })
  } catch (error: any) {
    console.error("[DELETE_USER_ERROR]:", error)
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
