import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { loginSchema } from "@/lib/validator"
import { ApiError } from "@/lib/errors"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = loginSchema.safeParse(body)

    if (!validation.success) {
      throw new ApiError(validation.error.issues[0].message, 400)
    }

    const { email, password } = validation.data

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new ApiError(error.message, 401)
    }

    return NextResponse.json(
      { 
        message: "Login successful",
        user: data.user,
        session: {
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          expires_at: data.session?.expires_at,
        }
      }, 
      { status: 200 }
    )

  } catch (error: any) {
    console.error("[LOGIN_ERROR]:", error)

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
