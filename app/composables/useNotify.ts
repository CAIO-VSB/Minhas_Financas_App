export function useNotify() {
  const notification = useNotification()

  const notifySuccess = (
    title: string,
    message: string,
    timer = 4500
  ) => {
    notification.success({
      title,
      message,
      position: 'topRight',
      timeout: timer,
      transitionIn: 'fadeInDown',
      transitionOut: 'fadeOutUp',
      backgroundColor: '#F0FDF4',
      titleColor: '#166534',
      messageColor: '#15803D',
      iconColor: '#16A34A',
      icon: 'mdi mdi-check-circle-outline',
      maxWidth: 420,
      close: false,
      drag: true,
    })
  }

  const notifyInfo = (
    title: string,
    message: string,
    timer = 4500,
    close = false,
    drag = true
  ) => {
    notification.info({
      title,
      message,
      position: 'topRight',
      timeout: timer,
      transitionIn: 'fadeInDown',
      transitionOut: 'fadeOutUp',
      backgroundColor: '#EFF6FF',
      titleColor: '#1E3A8A',
      messageColor: '#2563EB',
      iconColor: '#2563EB',
      icon: 'mdi mdi-information-outline',
      maxWidth: 420,
      close,
      drag,
    })
  }

    const notifyError = (title: string, message: string, timer?: number) => {
        useNotification().error({
            title: title,
            message: message,
            position: "topRight",
            timeout: timer,
            transitionIn: "fadeInUp",
            transitionOut: "fadeOut",
            backgroundColor: "#fef2f2",
            titleColor: "#7f1d1d",
            messageColor: "#991b1b",
            iconColor: "#dc2626",
            icon: "mdi mdi-alert-circle-outline",
            maxWidth: 380,
        })
    }

  return {
    notifySuccess,
    notifyInfo,
    notifyError,
  }
}