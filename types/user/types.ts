export type LoginForm = {
    email: string,
    password: string
}

export type RegisterForm = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}

export type ResetForm = Omit<RegisterForm, "name" | "email"> // Esse tipo lida com a page de nova senha

export type RecoveryForm = Omit<LoginForm, "password"> // Esse tipo lida com a page onde é inserio o e-mail de recuperação