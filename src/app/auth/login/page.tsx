'use client'

import { supabase } from "@/lib/supabase"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: any) => {
        const { email, password } = data
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
        } else {
            router.push('/')
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-4">Вход</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    {...register('email')}
                    className="w-full p-2 border rounded"
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                <input
                    type="password"
                    placeholder="Пароль"
                    {...register('password')}
                    className="w-full p-2 border rounded"
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Войти
                </button>

                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    )
}