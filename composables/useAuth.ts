export default function useCinemaCatalog() {
    const token = useCookie('token')
    const isAuthenticated = computed(() => !!token.value)
    return { token, isAuthenticated }
}