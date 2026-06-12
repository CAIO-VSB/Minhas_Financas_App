export function useNotify() {

    const notifySuccess = (title: string, message: string, timer?: number) => {
        useNotification().success({
            title: title,
            message: message,
            position: "topCenter",
            timeout: timer,
            transitionIn: "fadeInUp",
            transitionOut: "fadeOut",
            backgroundColor: "#f0fdf4",
            titleColor: "#14532d",
            messageColor: "#166534",
            iconColor: "#16a34a",
            icon: "mdi mdi-check-circle-outline",
            maxWidth: 380
        })
    }

    const notifyInfo = (title: string, message: string, timer?: number) => {
        useNotification().warning({
            title: title,
            message: message,
            position: "topRight",
            timeout: timer,
            transitionIn: "bounceInDown",
            transitionOut: "fadeOutUp",
            backgroundColor: "#eff6ff",
            titleColor: "#78350f",
            messageColor: "#78350f",
            iconColor: "#78350f",
            icon: "mdi mdi-alert-outline",
            maxWidth: 380
        })
    }

    const notifyError = (title: string, message: string, timer?: number) => {
        useNotification().error({
            title: title,
            message: message,
            position: "topCenter",
            timeout: timer,
            transitionIn: "fadeInUp",
            transitionOut: "fadeOut",
            backgroundColor: "#fef2f2",
            titleColor: "#7f1d1d",
            messageColor: "#991b1b",
            iconColor: "#dc2626",
            icon: "mdi mdi-alert-circle-outline",
            maxWidth: 380
        })
    }

    return {
        notifySuccess,
        notifyError,
        notifyInfo
    }
}