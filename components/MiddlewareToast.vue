<script setup>

    import { useNotify } from '~/store/modules/notify-store'

    const notify = useNotify()

</script>

<template>
    <div>
        <Toasts
            color="error-primary"
            :text="notify.messageNotify"
            timer="#E57373"
            v-model="notify.isVisible"
            icon="mdi-alert"
            size="x-large"
            color-icon="white"
            :timeout="7000"
        />
        
    </div>
</template>