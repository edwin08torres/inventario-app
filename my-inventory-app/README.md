Inventario React App
Este proyecto es una aplicación de inventario hecha con React (versión 18+) y usando JSON Server para simular el backend. Incluye un sistema de autenticación (mock con JWT), manejo de roles (admin/user), y diferentes módulos para CRUD de Usuarios, Categorías y Productos.


Tabla de Contenido
1-Características Principales
2-Instalación y Configuración
3-Ejecución en Desarrollo
4-Uso de la Aplicación
5-Descripción de Módulos
6-Notas sobre Autenticación
7-Despliegue
8-Contacto

Características Principales
    Login (simulado con JWT) y guardado de token en localStorage.
    Roles: admin y user.
    Control de Sesión:
        Sólo los usuarios admin pueden crear/editar/eliminar otros usuarios, productos, etc.
        Usuarios disabled no pueden acceder.
    Módulos CRUD:
        Usuarios: crear, editar, habilitar/deshabilitar, cambiar rol.
        Categorías: crear, editar, eliminar, listar.
        Productos: crear, editar, eliminar, listar, con relación a categorías.
    Búsqueda en cada módulo (filtro local o con JSON Server).
    Notificaciones (usando react-toastify).
    Responsive (Sidebar desplegable en pantallas pequeñas).
    Tecnologías: React 18+, Tailwind CSS, JSON Server, React Router, Axios, etc.

Instalación y Configuración
    1- Clonar el repositorio:
        git clone https://github.com/edwin08torres/inventario-app.git
        cd my-inventory-app
    2- Instalar dependencias:
        npm install
    Esto instalará las librerías de React, React Router, Axios, JSON Server, Tailwind, etc.
    3-Configurar JSON Server:
        *Verifica que tengas instalado json-server globalmente (opcional) o que esté incluido en devDependencies.
        *En la raíz del proyecto, existe un archivo db.json que simula la base de datos.
       
Ejecución en Desarrollo
    *Levantar JSON Server:        
        json-server --watch db.json --port 4000
    *Ejecutar la aplicación React:
        npm run dev
    Abre http://localhost:5173 (por defecto) para ver la aplicación.

    Nota: puedes cambiar el puerto si tu Vite/React App lo pone en otro, o si tu JSON Server corre en otro puerto.

Uso de la Aplicación
Login:
    Ve a http://localhost:5173/login.
    Ingresa credenciales existentes en db.json (p. ej. "username": "admin", "password": "admin123").
    Si la autenticación es exitosa, redirige al Home.

    Navegación:
    El layout incluye un sidebar (menú lateral) con enlaces a Usuarios, Categorías y Productos.
    En pantallas pequeñas, el botón “Menú” despliega/oculta el sidebar.

    Crear / Editar / Eliminar:
    Como admin, puedes hacer CRUD completo.
    Como user, solo visualizas (sin acciones de edición).

    Filtrar:
    Cada módulo tiene una caja de búsqueda + botón “Buscar”, y/o un botón “Borrar Filtro” para mostrar todos.
    
    Logout:
    El botón “Logout” (ubicado en el layout o sidebar) cierra la sesión, borra el token y redirige a /login.

Descripción de Módulos
    Autenticación (LoginPage)
        Simula un “JWT” guardado en localStorage.
        Valida username y password en db.json.
        Si enabled = false, no deja loguear.

    Usuarios (UsersPage)
    Admin puede:
        Crear un nuevo usuario (username, password, role, enabled).
        Editar usuarios existentes.
        Habilitar/Deshabilitar.
        Cambiar rol (admin ↔ user).
    User no ve este módulo.
    Filtro: busca por username.

    Categorías (CategoriesPage)
    Admin puede:
        Crear, Editar, Eliminar.
    User solo visualiza la lista.
    Filtro: busca por name.

    Productos (ProductsPage)
    Admin puede:
        Crear (con name, categoryId, price, stock).
        Editar y Eliminar.
    User solo visualiza.
        Filtro: busca por name.

Notas sobre Autenticación
    La autenticación está simulada: se hace un GET a db.json para ver si existe el usuario con esas credenciales.
    Al “loguear”, se guarda un token ficticio ("fakeJWTToken123") en localStorage.
    El AuthContext maneja la lógica de handleLogin y handleLogout.

Despliegue
    Build de Producción:
        npm run build
        Genera carpeta dist/ lista para subir a un hosting estático (Netlify, Vercel, etc.).
    Subida a Netlify o Vercel:
        Sube la carpeta dist.
        Configura que el framework es “React” o “Vite”.
        No olvides correr JSON Server en un servicio separado (o contar con un backend real).


Autor:  Edwin Torrez
Correo: at2899743@gmail.com
Proyecto: https://github.com/edwin08torres/inventario-app/tree/t-dev

Si tienes dudas o problemas, no dudes en escribir. ¡Gracias por probar la aplicación!