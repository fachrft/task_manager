"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateProfileSchema, UpdateProfileData } from "@/lib/validator"
import { createClient } from "@/utils/supabase/client"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import { Loader2, Trash2, UserCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState("")
  
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) {
          router.push("/login")
          return
        }
        setUserId(authUser.id)
        
        const res = await api.get(`/users/${authUser.id}`)
        form.reset({
          name: res.data.name || "",
          email: res.data.email || "",
        })
      } catch (error) {
        toast.error("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [supabase.auth, router, form])

  const onSubmit = async (data: UpdateProfileData) => {
    if (!userId) return
    setIsUpdating(true)
    try {
      await toast.promise(api.put(`/users/${userId}`, data), {
        loading: "Updating profile...",
        success: "Profile updated successfully!",
        error: "Failed to update profile",
      }, {
        id: "update-profile",
      })

      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!userId) return
    setIsDeleting(true)
    try {
      await toast.promise(api.delete(`/users/${userId}`), {
        loading: "Deleting account...",
        success: "Account deleted permanently",
        error: "Failed to delete account",
      }, {
        id: "delete-account"
      })
      router.push("/login")
    } catch (error) {
      console.error(error)
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <div className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <UserCircle className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-foreground/90">Personal Information</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" disabled={isUpdating} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      disabled={isUpdating}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isUpdating} className="mt-2 cursor-pointer">
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </div>

      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="cursor-pointer gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account, 
                all your tasks, and remove your data from our servers.
                <br /><br />
                Please type <strong>CONFIRM</strong> below to proceed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="my-2">
              <Input 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type CONFIRM"
                className="col-span-3"
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => setConfirmText("")} 
                className="cursor-pointer"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  if (confirmText !== "CONFIRM") {
                    e.preventDefault();
                    toast.error("Please type CONFIRM to delete account");
                    return;
                  }
                  handleDeleteAccount();
                }}
                disabled={confirmText !== "CONFIRM" || isDeleting}
                className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete Everything"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
