import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import {
    View,
    Text,
    Animated,
    StyleSheet,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

// Toast types
type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void
    showSuccess: (message: string) => void
    showError: (message: string) => void
    showInfo: (message: string) => void
    showWarning: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

// Toast colors
const toastColors: Record<ToastType, { bg: string; icon: string; border: string }> = {
    success: { bg: '#E8F5E9', icon: '#4CAF50', border: '#4CAF50' },
    error: { bg: '#FFEBEE', icon: '#F44336', border: '#F44336' },
    info: { bg: '#E3F2FD', icon: '#2196F3', border: '#2196F3' },
    warning: { bg: '#FFF8E1', icon: '#FF9800', border: '#FF9800' },
}

const toastIcons: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
    success: 'checkmark-circle',
    error: 'close-circle',
    info: 'information-circle',
    warning: 'warning',
}

// Toast Item Component
const ToastItem: React.FC<{
    toast: Toast
    onHide: (id: string) => void
}> = ({ toast, onHide }) => {
    const translateY = useRef(new Animated.Value(-100)).current
    const opacity = useRef(new Animated.Value(0)).current
    const insets = useSafeAreaInsets()

    useEffect(() => {
        // Animate in
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start()

        // Auto hide
        const timeout = setTimeout(() => {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -100,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                onHide(toast.id)
            })
        }, toast.duration || 3000)

        return () => clearTimeout(timeout)
    }, [])

    const colors = toastColors[toast.type]
    const icon = toastIcons[toast.type]

    return (
        <Animated.View
            style={[
                styles.toastContainer,
                {
                    backgroundColor: colors.bg,
                    borderLeftColor: colors.border,
                    marginTop: insets.top + 8,
                    transform: [{ translateY }],
                    opacity,
                },
            ]}
        >
            <Ionicons name={icon} size={22} color={colors.icon} style={styles.icon} />
            <Text style={styles.message} numberOfLines={2}>{toast.message}</Text>
        </Animated.View>
    )
}

// Toast Provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
        const id = Date.now().toString()
        setToasts((prev) => [...prev, { id, message, type, duration }])
    }, [])

    const showSuccess = useCallback((message: string) => {
        showToast(message, 'success')
    }, [showToast])

    const showError = useCallback((message: string) => {
        // For demo: only log to console, don't show toast UI
        console.error('[Toast Error]:', message)
    }, [])

    const showInfo = useCallback((message: string) => {
        showToast(message, 'info')
    }, [showToast])

    const showWarning = useCallback((message: string) => {
        showToast(message, 'warning')
    }, [showToast])

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo, showWarning }}>
            {children}
            {/* Toast container */}
            <View style={styles.overlay} pointerEvents="box-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onHide={hideToast} />
                ))}
            </View>
        </ToastContext.Provider>
    )
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        elevation: 10,
        alignItems: 'center',
    },
    toastContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        maxWidth: '90%',
        minWidth: '80%',
    },
    icon: {
        marginRight: 12,
    },
    message: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        lineHeight: 20,
    },
})
