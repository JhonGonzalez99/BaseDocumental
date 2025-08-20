import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { 
  Plus, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Users, 
  Edit, 
  Trash2, 
  RefreshCw,
  ArrowLeft,
  Monitor
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  _id?: string
  id?: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}

interface AuthenticatedUser {
  id: string
  name: string
  email: string
}

// Schema para crear usuario
const createUserSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
})

// Schema para actualizar usuario
const updateUserSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
})

export const Home = () => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [error, setError] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const navigate = useNavigate()

  // Formularios
  const createForm = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const updateForm = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchUsers()
    } else {
      navigate("/login")
    }
  }, [navigate])

  const fetchUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const response = await axios.get("http://localhost:3000/api/users")
      console.log("Users data from backend:", response.data)
      setUsers(response.data)
    } catch (err: any) {
      console.error("Error fetching users:", err)
      setError("Error al cargar usuarios")
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const handleCreateUser = async (values: z.infer<typeof createUserSchema>) => {
    setIsLoading(true)
    setError("")

    try {
      await axios.post("http://localhost:3000/api/users", values, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      setIsCreateDialogOpen(false)
      createForm.reset()
      fetchUsers()
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response.data.errors?.[0]?.msg || "Datos inválidos")
      } else {
        setError("Error al crear usuario")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = async (values: z.infer<typeof updateUserSchema>) => {
    if (!selectedUser) return

    const userId = selectedUser._id || selectedUser.id
    console.log("Selected user for edit:", selectedUser)
    console.log("User ID for edit:", userId)

    if (!userId) {
      setError("ID de usuario no válido")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await axios.put(`http://localhost:3000/api/users/${userId}`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      setIsEditDialogOpen(false)
      setSelectedUser(null)
      updateForm.reset()
      fetchUsers()
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response.data.errors?.[0]?.msg || "Datos inválidos")
      } else {
        setError("Error al actualizar usuario")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    const userId = selectedUser._id || selectedUser.id
    console.log("Selected user for delete:", selectedUser)
    console.log("User ID for delete:", userId)

    if (!userId) {
      setError("ID de usuario no válido")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`)

      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (err: any) {
      setError("Error al eliminar usuario")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    updateForm.reset({
      name: user.name,
      email: user.email,
      password: "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Panel de Administración, Proyecto Antivirus</h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              Bienvenido, {user.name} - Gestiona los usuarios del sistema
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                  <DialogDescription>
                    Completa el formulario para crear un nuevo usuario en el sistema.
                  </DialogDescription>
                </DialogHeader>
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(handleCreateUser)} className="space-y-4">
                    <FormField
                      control={createForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Juan Pérez" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="juan@ejemplo.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input placeholder="••••••••" type="password" {...field} />
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
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creando..." : "Crear Usuario"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="outline"
              onClick={() => navigate("/maintenance")}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Settings className="w-4 h-4" />
              Modo Mantenimiento
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                  <Monitor className="w-4 h-4" />
                  Monitor del Sistema
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Monitor del Sistema</DialogTitle>
                  <DialogDescription>
                    Estado actual de la protección y rendimiento del sistema
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Estado del sistema */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-primary">Estado del Sistema</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium">Estado</span>
                        <span className="text-green-600 font-semibold">Protegido</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium">Protección</span>
                        <span className="text-blue-600 font-semibold">Excelente</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium">Privacidad</span>
                        <span className="text-green-600 font-semibold">Protegido</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium">Rendimiento</span>
                        <span className="text-purple-600 font-semibold">Óptimo</span>
                      </div>
                    </div>
                  </div>

                  {/* Mensaje de estado */}
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-base font-medium text-green-800">
                      Este computador está protegido
                    </p>
                  </div>

                  {/* Botón de ayuda */}
                  <div className="pt-4 border-t border-border">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Centro de Ayuda
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">Centro de Ayuda</DialogTitle>
                          <DialogDescription>
                            Información útil para usar el sistema de administración de usuarios
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Funcionalidades principales */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-primary">Funcionalidades Principales</h3>
                            <div className="grid gap-3">
                              <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                                <Plus className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium">Crear Usuario</p>
                                  <p className="text-sm text-muted-foreground">Agrega nuevos usuarios al sistema con nombre, email y contraseña</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                                <Edit className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium">Editar Usuario</p>
                                  <p className="text-sm text-muted-foreground">Modifica la información de usuarios existentes</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                                <Trash2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium">Eliminar Usuario</p>
                                  <p className="text-sm text-muted-foreground">Elimina usuarios del sistema (acción irreversible)</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Consejos de uso */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-primary">Consejos de Uso</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start space-x-2">
                                <span className="text-primary font-bold">•</span>
                                <span>Las contraseñas deben tener al menos 6 caracteres</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span className="text-primary font-bold">•</span>
                                <span>Los emails deben ser únicos en el sistema</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span className="text-primary font-bold">•</span>
                                <span>Puedes usar el modo mantenimiento para trabajos técnicos</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span className="text-primary font-bold">•</span>
                                <span>La tabla se actualiza automáticamente después de cada operación</span>
                              </div>
                            </div>
                          </div>

                          {/* Información del sistema */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-primary">Información del Sistema</h3>
                            <div className="grid gap-2 text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium">Total de usuarios:</span>
                                <span className="text-muted-foreground">{users.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Usuario actual:</span>
                                <span className="text-muted-foreground">{user?.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Email:</span>
                                <span className="text-muted-foreground">{user?.email}</span>
                              </div>
                            </div>
                          </div>

                          {/* Contacto */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-primary">¿Necesitas más ayuda?</h3>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm text-blue-800">
                                Si tienes alguna pregunta o encuentras algún problema, contacta al equipo de soporte técnico.
                              </p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Usuarios registrados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Usuarios */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
            <CardDescription>
              Gestiona todos los usuarios del sistema. Puedes crear, editar y eliminar usuarios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">Cargando usuarios...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">ID</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No hay usuarios registrados
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => {
                        const userId = user._id || user.id
                        return (
                          <TableRow key={userId}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell className="break-all">{user.email}</TableCell>
                            <TableCell className="hidden md:table-cell font-mono text-xs">
                              {userId}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(user)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDeleteDialog(user)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica la información del usuario seleccionado.
            </DialogDescription>
          </DialogHeader>
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(handleEditUser)} className="space-y-4">
              <FormField
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="juan@ejemplo.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva contraseña (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} />
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
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Actualizando..." : "Actualizar Usuario"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Usuario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar al usuario "{selectedUser?.name}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : "Eliminar Usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
