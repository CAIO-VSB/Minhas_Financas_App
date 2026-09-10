export default defineNuxtRouteMiddleware(async (to, from) => {
	const { $authClient } = useNuxtApp()
	const { data: session } = await $authClient.getSession()

	const isAutenticated = !!session?.session.token

	const publicRoutes = ['/login-page', '/register-page', '/recover-password-page', '/reset-password-page', '/unauthorized']

	if (!isAutenticated && !publicRoutes.includes(to.path)) {
		return navigateTo('/unauthorized')
	}
});