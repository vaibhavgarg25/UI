'use client'

import { toast as sonnerToast } from 'sonner'

type ToastProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

function toast({ title, description, action }: ToastProps) {
  return sonnerToast(title ?? '', {
    description,
    action,
  })
}

function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
    toasts: [],
  }
}

export { useToast, toast }