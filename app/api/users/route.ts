import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { registerSchema } from "@/lib/validator"
import { prisma } from "@/utils/prisma"
import { ApiError } from "@/lib/errors"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = registerSchema.safeParse(body)

    if (!validation.success) {
      throw new ApiError(validation.error.issues[0].message, 400)
    }

    const { name, email, password } = validation.data

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new ApiError("Email already registered", 400)
    }

    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        }
      }
    })

    if (authError) throw new ApiError(authError.message, 400)
    if (!authData.user) throw new ApiError("Failed to create user account", 500)

    await prisma.user.create({
      data: {
        id: authData.user.id,
        name,
        email,
      },
    })

    return NextResponse.json(
      { message: "Registration successful!" },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("[REGISTER_ERROR]:", error)
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
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    })
    return NextResponse.json(users, { status: 200 })
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
