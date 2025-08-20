"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const registerSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export const Register = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true)
    setError("")
    
    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      // Guardar datos del usuario en localStorage
      localStorage.setItem("user", JSON.stringify(response.data))
      
      // Redirigir a home
      navigate("/")
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError("El email ya está registrado")
      } else if (err.response?.status === 500) {
        setError("Error del servidor. Intenta de nuevo.")
      } else {
        setError("Error de conexión. Verifica tu conexión a internet.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar con formulario */}
      <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh] lg:min-h-screen">
        <div className="w-full max-w-md space-y-6">
          {/* Logo del SENA */}
          <div className="text-center">
            <img 
              src="https://oficinavirtualderadicacion.sena.edu.co/oficinavirtual/Resources/logoSenaNaranja.png"
              alt="Logo SENA"
              className="mx-auto w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain"
            />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Crear Cuenta</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Completa el formulario para crear tu cuenta
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Tu nombre completo" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="tu@email.com" 
                        type="email"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        type="password"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        type="password"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>
          </Form>

          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              ¿Olvidaste tu contraseña?{" "}
              <a 
                href="/forgot-password" 
                className="text-primary hover:underline font-medium"
              >
                Recupérala aquí
              </a>
            </p>
            
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <a 
                href="/login" 
                className="text-primary hover:underline font-medium"
              >
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Imagen de fondo */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center min-h-[50vh] lg:min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="text-center text-white space-y-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center">
            <UserPlus className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Únete a nosotros</h2>
          <p className="text-base sm:text-lg opacity-90">
            Crea tu cuenta y comienza tu experiencia
          </p>
        </div>
      </div>
    </div>
  )
}
