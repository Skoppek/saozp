import { createContext } from "react"

export type ToastType = 'success' | 'failure' | 'warning';

export interface ToastContextValue {
    showToast: (params: {content: string, type: ToastType}) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)