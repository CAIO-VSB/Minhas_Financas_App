
export default defineNuxtRouteMiddleware(async (to, from) => {
	const { $authClient } = useNuxtApp()

	const { data: session } = await $authClient.useSession(useFetch)
	if (!session.value) {
		if (to.path === "/dashboard") {
			return navigateTo("/unauthorized");
		}
	}
});