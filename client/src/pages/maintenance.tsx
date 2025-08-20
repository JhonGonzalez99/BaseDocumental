import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { RefreshCw, ArrowLeft } from "lucide-react"

export const Maintenance = () => {
  const navigate = useNavigate()

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="text-center border-0 shadow-2xl bg-card backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            <div className="mx-auto w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-amber-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
            </div>
            
            <CardTitle className="text-2xl font-bold">
              Sitio en Mantenimiento
            </CardTitle>
            
            <CardDescription className="text-base text-muted-foreground leading-relaxed">
              Estamos realizando mejoras en nuestro sistema para brindarte una mejor experiencia.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Información del problema */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg 
                  className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-800">
                    ¿Qué está pasando?
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Nuestro equipo técnico está trabajando para resolver problemas de rendimiento y agregar nuevas funcionalidades.
                  </p>
                </div>
              </div>
            </div>

            {/* Recomendación */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg 
                  className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <div className="text-left">
                  <p className="text-sm font-medium text-green-800">
                    ¿Qué puedes hacer?
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Te recomendamos intentar acceder nuevamente en unos minutos. El mantenimiento suele completarse rápidamente.
                  </p>
                </div>
              </div>
            </div>

            {/* Tiempo estimado */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg 
                  className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <div className="text-left">
                  <p className="text-sm font-medium text-amber-800">
                    Tiempo estimado
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Esperamos completar el mantenimiento en aproximadamente 15-30 minutos.
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <Button 
                onClick={handleRefresh} 
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar de nuevo
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleGoHome}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ir a página principal
              </Button>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-input">
              <p className="text-xs text-muted-foreground">
                Si el problema persiste, contacta a nuestro equipo de soporte
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Gracias por tu paciencia
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 