import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { ApiError } from "@/lib/errors"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new ApiError("Unauthorized", 401)
    }
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new ApiError(error.message, 400)
    }

    return NextResponse.json({ message: "Logout successful" }, { status: 200 })
  } catch (error: any) {
    console.error("[LOGOUT_ERROR]:", error)
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
