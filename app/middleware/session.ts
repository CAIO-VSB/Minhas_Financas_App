
export default defineNuxtRouteMiddleware(async (to, from) => {
    const { $authClient } = useNuxtApp()

    const { data: session } = await $authClient.useSession(useFetch); 
    if (!session.value) {
        return navigateTo("/session");
    }
})