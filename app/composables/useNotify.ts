export function useNotify() {

    const notifySuccess = (title: string, message: string, timer?: number) => {
        useNotification().success({
            title: title,
            message: message,
            position: "topCenter",
            timeout: timer
        })
    }

    const notifyInfo = (title: string, message: string, timer?: number) => {
        useNotification().info({
            title: title,
            message: message,
            position: "topCenter",
            timeout: timer
        })
    }

    const notifyError = (title: string, message: string, timer?: number) => {
        useNotification().error({
            title: title,
            message: message,
            position: "topCenter",
            timeout: timer
        })
    }

    return {
        notifySuccess,
        notifyError,
        notifyInfo
    }
}