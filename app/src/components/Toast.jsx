import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { X } from 'lucide-react'

const ToastContext = createContext(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const typeClasses = {
            info: 'border-l-[3px] border-l-status-blue',
            success: 'border-l-[3px] border-l-status-green',
            warning: 'border-l-[3px] border-l-status-orange',
          }[toast.type] || '';

          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-md bg-bg-elevated border border-border-default shadow-lg text-text-primary text-[0.8125rem] min-w-[280px] max-w-[400px] pointer-events-auto animate-[toastIn_0.3s_ease_forwards] ${typeClasses}`}
            >
              <span className="flex-1">{toast.message}</span>
              <button
                className="text-text-faint cursor-pointer p-0.5 rounded transition-all duration-150 ease-in flex items-center hover:bg-border-muted hover:text-text-primary"
                onClick={() => removeToast(toast.id)}
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
