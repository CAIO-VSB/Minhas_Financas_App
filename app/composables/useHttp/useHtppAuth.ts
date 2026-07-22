export function useHttpAuth() {

    const getAllAuthAccounts = () => {
        return $fetch("/api/auth", {method: "GET"})
    }

    const postVerifyPassword = (data: string) => {
        return $fetch("/api/auth/index.verifyPassword", {method: "POST", body: {password: data}})
    }

    return {
        getAllAuthAccounts,
        postVerifyPassword
    }

}