"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back to your task manager.
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 cursor-pointer">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add a new task to your list. Fill in the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="e.g. Finish the presentation" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Add details about your task here..." 
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" className="cursor-pointer">Save Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Content Section */}
        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-border/60 bg-card/30 p-8 text-center backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-accent/50 p-4">
              <span className="text-2xl">📋</span>
            </div>
            <p className="max-w-[200px] text-sm font-medium text-muted-foreground">
              Your task list will appear here very soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
