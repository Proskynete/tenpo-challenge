# Movie Database Application

Aplicación completa con autenticación, lista de películas con scroll infinito y virtualización.

## Características Implementadas

### 1. Pantalla de Login
- Formulario con validación de correo y contraseña
- Conexión con MSW (Mock Service Worker) para simular API
- Guarda token en cookies al hacer login exitoso
- Redirección automática a la home después del login
- Manejo de errores con mensajes amigables

**Credenciales de prueba:**
- Email: `leopoldo.henchoz@tenpo.cl`
- Password: cualquier contraseña

### 2. Pantalla Home
- Lista de 2000 películas mock generadas
- Infinite scroll con TanStack Query
- Virtualización con @tanstack/react-virtual para rendimiento óptimo
- Botón de logout que:
  - Limpia las cookies
  - Redirige al login

### 3. Routing y Protección
- Routing con Wouter (ligero y eficiente)
- Rutas protegidas: Home solo accesible con token válido
- Redirección automática al login si no hay token
- Redirección automática a home si ya está autenticado

### 4. Estilos
- Tailwind CSS v4 para todos los estilos
- UI moderna y responsive
- Diseño limpio y profesional
- Optimizado para mobile y desktop

## Stack Tecnológico

- **React 19** con TypeScript
- **Vite** como build tool
- **TanStack Query** para manejo de estado asíncrono
- **TanStack Virtual** para virtualización de listas
- **Wouter** para routing
- **MSW** para mock de APIs
- **Axios** para peticiones HTTP
- **js-cookie** para manejo de cookies
- **Tailwind CSS v4** para estilos

## Estructura del Proyecto

```
src/
├── components/
│   ├── ProtectedRoute.tsx      # Componente para proteger rutas
│   └── MovieList.tsx            # Lista virtualizada de películas
├── pages/
│   ├── Login.tsx                # Página de login
│   └── Home.tsx                 # Página principal
├── services/
│   ├── auth.service.ts          # Servicio de autenticación y cookies
│   └── movies.service.ts        # Servicio de películas
├── hooks/
│   └── useAuth.ts               # Hook personalizado para autenticación
├── mocks/
│   ├── handlers/
│   │   ├── auth/                # Handlers MSW para autenticación
│   │   └── movies/              # Handlers MSW para películas
│   │       ├── handlers.ts
│   │       └── mock-data.ts     # 2000 películas generadas
│   ├── browser.ts
│   └── server.ts
├── lib/
│   └── queryClient.ts           # Configuración de TanStack Query
├── App.tsx                      # Configuración de routing
└── main.tsx                     # Entry point
```

## Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview

# Ejecutar linter
npm run lint

# Formatear código
npm run format
```

## Flujo de la Aplicación

1. **Usuario no autenticado:**
   - Ve la pantalla de login
   - Ingresa credenciales (usar email: `leopoldo.henchoz@tenpo.cl`)
   - Al hacer login exitoso, el token se guarda en cookies
   - Es redirigido automáticamente a la home

2. **Usuario autenticado:**
   - Ve la lista de películas en la home
   - Puede hacer scroll infinito para cargar más películas
   - La lista está virtualizada para máximo rendimiento
   - Puede hacer logout desde el botón en el header
   - Al hacer logout, es redirigido al login

3. **Protección de rutas:**
   - Si intenta acceder a `/` sin token, es redirigido a `/login`
   - Si ya está autenticado e intenta ir a `/login`, es redirigido a `/`

## Características Técnicas

### Virtualización
La lista de películas usa `@tanstack/react-virtual` para renderizar solo los elementos visibles en el viewport, lo que permite manejar 2000 elementos con excelente rendimiento.

### Infinite Scroll
TanStack Query maneja automáticamente:
- Paginación de datos
- Carga de siguiente página al llegar al final
- Estados de loading y error
- Cache de datos ya cargados

### Manejo de Sesión
- Token guardado en cookies con expiración de 7 días
- Validación de token en cada carga de la aplicación
- Limpieza automática de cookies al hacer logout

### MSW (Mock Service Worker)
- Simula API real sin necesidad de backend
- Delays realistas para simular red
- 2000 películas mock generadas programáticamente
- Paginación de 20 elementos por página

## URL de Desarrollo

La aplicación está corriendo en: **http://localhost:5174/**

## Notas Adicionales

- La aplicación está completamente tipada con TypeScript
- Usa React hooks modernos (useState, useEffect, useCallback, custom hooks)
- Implementa buenas prácticas de separación de responsabilidades
- Los servicios están desacoplados de los componentes
- El código sigue las convenciones de código limpio y mantenible
