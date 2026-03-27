"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TaskCard } from "@/components/task-card"
import { TaskFormModal } from "@/components/task-form-modal"
import { Task } from "@/types/task"
import { taskService } from "@/services/api"
import { TaskData } from "@/lib/validator"
import toast from "react-hot-toast"

function TaskSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4">
      <Skeleton className="mt-0.5 h-5 w-5 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await taskService.getMyTasks()
      setTasks(res.data)
    } catch (error) {
      toast.error("Failed to fetch tasks")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Create Task
  const handleCreate = async (data: TaskData) => {
    setIsSubmitting(true)
    try {
      await toast.promise(
        taskService.createTask(data),
        {
          loading: "Creating task...",
          success: "Task created!",
          error: "Failed to create task",
        },
        {
          id: "task-action",
        }
      )
      setIsCreateOpen(false)
      fetchTasks()
    } catch (error) {
    } finally {
      setIsSubmitting(false)
    }
  }

  // Edit Task
  const handleEdit = async (data: TaskData) => {
    if (!editingTask) return
    setIsSubmitting(true)
    try {
      await toast.promise(
        taskService.updateTask(editingTask.id, data),
        {
          loading: "Updating task...",
          success: "Task updated!",
          error: "Failed to update task",
        },
        { id: "task-action" }
      )
      setEditingTask(null)
      fetchTasks()
    } catch (error) {
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle Complete
  const handleToggleComplete = async (task: Task) => {
    const originalTasks = [...tasks]
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, is_completed: !t.is_completed } : t
      )
    )
    try {
      await taskService.updateTask(task.id, {
        title: task.title,
        description: task.description,
        isCompleted: !task.is_completed,
      })
    } catch (error) {
      toast.error("Failed to update task status")
      setTasks(originalTasks)
    }
  }

  // Delete Task
  const handleDelete = async (taskId: string) => {
    try {
      await toast.promise(
        taskService.deleteTask(taskId),
        {
          loading: "Deleting task...",
          success: "Task deleted!",
          error: "Failed to delete task",
        },
        {
          id: "task-action",
        }
      )
      fetchTasks()
    } catch (error) {}
  }

  const completedCount = tasks.filter((t) => t.is_completed).length
  const totalCount = tasks.length

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-5 w-1/4" />
          </div>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Your Task Manager
            </h1>
            <p className="text-muted-foreground">
              {totalCount === 0
                ? "No tasks yet. Create your first task!"
                : `${completedCount} of ${totalCount} tasks completed`}
            </p>
          </div>

          <Button
            className="cursor-pointer gap-2"
            onClick={() => setIsCreateOpen(true)}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Task List */}
        <div className="flex flex-col gap-3">
          {tasks.length === 0 ? (
            // Empty State
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-border/60 bg-card/30 p-8 text-center backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-accent/50 p-4">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <p className="text-sm font-medium">No tasks yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Click &quot;New Task&quot; to get started
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Task Cards
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={(task) => setEditingTask(task)}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* Create Modal */}
      <TaskFormModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
      />

      {/* Edit Modal */}
      <TaskFormModal
        open={!!editingTask}
        onOpenChange={(open) => {
          if (!open) setEditingTask(null)
        }}
        onSubmit={handleEdit}
        isLoading={isSubmitting}
        task={editingTask}
      />
    </div>
  )
}
