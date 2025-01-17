# 📦 Inventario React App

Este proyecto es una aplicación de inventario desarrollada con **React** y usando **MockAPI.IO** para simular el backend. Incluye un sistema de autenticación, manejo de roles (admin/user) y módulos para gestionar usuarios, categorías y productos.

---

## 📑 Tabla de Contenido

1. [Características Principales](#características-principales)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Ejecución en Desarrollo](#ejecución-en-desarrollo)
4. [Uso de la Aplicación](#uso-de-la-aplicación)
5. [Descripción de Módulos](#descripción-de-módulos)
6. [Notas sobre Autenticación](#notas-sobre-autenticación)
7. [Despliegue](#despliegue)
8. [Contacto](#contacto)

---

## ✨ Características Principales

- 🔑 **Login**: Simulado con JWT y token almacenado en `localStorage`.
- 👤 **Roles**:
  - **Admin**: CRUD completo en todos los módulos.
  - **User**: Solo visualización.
- 🚪 **Control de Sesión**:
  - Usuarios deshabilitados no pueden acceder.
  - Solo los admins pueden gestionar usuarios, productos, etc.
- 📋 **Módulos CRUD**:
  - **Usuarios**: Crear, editar, habilitar/deshabilitar, cambiar roles.
  - **Categorías**: Crear, editar, eliminar, listar.
  - **Productos**: Crear, editar, eliminar, listar con relación a categorías.
- 🔍 **Búsqueda**: Filtros locales en cada módulo.
- 📢 **Notificaciones**: Usando `react-toastify`.
- 📱 **Responsive**: Sidebar desplegable en pantallas pequeñas.
- 🛠 **Tecnologías**: React 18+, Tailwind CSS, JSON Server, React Router, Axios.

---

## 🛠 Instalación y Configuración

1. **Clonar el repositorio**:

```bash
# Clona el repositorio y accede a la carpeta
git clone https://github.com/edwin08torres/inventario-app.git
cd inventario-app

Instalar dependencias:
    # Instala las dependencias necesarias
    npm install

🚀 Ejecución en Desarrollo
    Ejecutar la aplicación React: npm run dev
        Abre http://localhost:5173 (o el puerto que se indique) en tu navegador.
        💡 Nota: Puedes ajustar los puertos según la configuración de tu entorno.


💻 Uso de la Aplicación
    🔑 Login
        Ve a http://localhost:5173/login.
        Ingresa credenciales existentes del db.json (p. ej., username: admin, password: admin123).
        Si es exitoso, serás redirigido al Home.
    🧭 Navegación
        Sidebar: Incluye enlaces a los módulos de Usuarios, Categorías y Productos.
        Pantallas pequeñas: Usa el botón “Menú” para desplegar/ocultar el sidebar.
    ✏️ Crear / Editar / Eliminar
        Los admins tienen acceso completo al CRUD.
        Los users solo pueden visualizar datos.
    🔍 Filtrar
        Cada módulo incluye una caja de búsqueda y botón Buscar.
        Usa el botón Borrar Filtro para restablecer.
    🚪 Logout
        Haz clic en el botón Logout para cerrar sesión, borrar el token y redirigir a la página de login.

🗂 Descripción de Módulos
    🔒 Autenticación (LoginPage)
        Simula un JWT almacenado en localStorage.
        Valida credenciales (username/password) contra db.json.
        Usuarios deshabilitados (enabled: false) no pueden iniciar sesión.

    👥 Usuarios (UsersPage)
    Admin puede:
        Crear usuarios (username, password, role, enabled).
        Editar usuarios existentes.
        Habilitar/deshabilitar usuarios.
        Cambiar roles (admin ↔ user).
    User no puede acceder a este módulo.
    Filtro: Buscar por username.
    🗃 Categorías (CategoriesPage)
    Admin puede:
        Crear, editar y eliminar categorías.
    User solo puede visualizar.
    Filtro: Buscar por name.

    📦 Productos (ProductsPage)
    Admin puede:
        Crear productos (name, categoryId, price, stock).
        Editar y eliminar productos.
    User solo puede visualizar.
    Filtro: Buscar por name.

🔐 Notas sobre Autenticación
    La autenticación está simulada.
    Se utiliza un token ficticio (fakeJWTToken123) almacenado en localStorage.
    AuthContext maneja la lógica de inicio/cierre de sesión.

🌍 Despliegue
    Generar Build de Producción:npm run build
Subir a Hosting:
    Usa plataformas como Netlify o Vercel.
    Configura el framework como React o Vite.

📞 Contacto
    Autor: Edwin Torrez
    Correo: at2899743@gmail.com
    Repositorio: Inventario App
```
