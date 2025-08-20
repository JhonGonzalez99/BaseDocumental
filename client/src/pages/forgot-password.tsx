"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Check, LogIn, RotateCcw, Key } from "lucide-react"

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

const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }),
})

export const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true)
    setError("")
    setSuccess(false)
    
    try {
      // Simular reset de contraseña - en un caso real esto iría al backend
      const response = await axios.post("http://localhost:3000/api/auth/forgot-password", {
        email: values.email,
        newPassword: "password123"
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      setSuccess(true)
      form.reset()
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("No se encontró una cuenta con ese email")
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
            <h1 className="text-2xl sm:text-3xl font-bold">Recuperar Contraseña</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Ingresa tu email para restablecer tu contraseña
            </p>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  ¡Contraseña Restablecida!
                </h3>
                <p className="text-sm text-green-700 mb-4">
                  Tu nueva contraseña es: <span className="font-mono font-bold bg-green-100 px-2 py-1 rounded">password123</span>
                </p>
                <p className="text-xs text-green-600">
                  Te recomendamos cambiar esta contraseña después de iniciar sesión.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate("/login")} 
                  className="w-full"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Ir al Login
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSuccess(false)
                    form.reset()
                  }}
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restablecer otra contraseña
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  {isLoading ? "Procesando..." : "Restablecer Contraseña"}
                </Button>
              </form>
            </Form>
          )}

          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              ¿Recordaste tu contraseña?{" "}
              <a 
                href="/login" 
                className="text-primary hover:underline font-medium"
              >
                Inicia sesión aquí
              </a>
            </p>
            
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <a 
                href="/register" 
                className="text-primary hover:underline font-medium"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Imagen de fondo */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center min-h-[50vh] lg:min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="text-center text-white space-y-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center">
            <Key className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Recupera tu acceso</h2>
          <p className="text-base sm:text-lg opacity-90">
            Te ayudaremos a restablecer tu contraseña de forma segura
          </p>
        </div>
      </div>
    </div>
  )
} 