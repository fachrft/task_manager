"use client"

import { useState, useEffect, useCallback } from "react"
import { taskService } from "@/services/api"
import { Task } from "@/types/task"
import { TaskCard } from "@/components/task-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Navbar } from "@/components/navbar"

function TaskSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4">
      <Skeleton className="mt-0.5 h-5 w-5 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between mt-3 gap-2">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await taskService.getAllTasks()
      setTasks(res.data)
    } catch (error) {
      console.error("Failed to fetch public tasks", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return (
    <>
      <Navbar />
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Public Task Board</h1>
              <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                See what everyone is working on. Login to create and manage your own tasks!
              </p>
            </div>
          </div>

          {/* Task List */}
          <div className="flex flex-col gap-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <TaskSkeleton key={i} />)
            ) : tasks.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border/60 bg-card/30 p-8 text-center backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-full bg-accent/50 p-4">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">No public tasks found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Be the first to create a task!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
