# Módulo de Gestión de Usuarios - Frontend

Aplicación web Single Page Application (SPA) desarrollada con **Vue 3**, **Pinia**, **Vue Router** y **Tailwind CSS**. Implementa un módulo CRUD interactivo de administración de usuarios, autenticación simulada, exportación a Excel y pruebas unitarias con **Vitest** y **JSDOM**.

---

## 🛠️ Tecnologías Utilizadas

* **Framework:** [Vue 3](https://vuejs.org/) (Composition API - \`<script setup>\`)
* **Gestión de Estado:** [Pinia](https://pinia.vuejs.org/)
* **Enrutamiento:** [Vue Router](https://router.vuejs.org/) (Guardián de navegación global)
* **Estilos & UI:** [Tailwind CSS v4](https://tailwindcss.com/) & [FontAwesome 7](https://fontawesome.com/)
* **Cliente HTTP:** [Axios](https://axios-http.com/)
* **Interacciones / Alertas:** [SweetAlert2](https://sweetalert2.github.io/)
* **Exportación de Datos:** [SheetJS (xlsx)](https://sheetjs.com/)
* **Testing:** [Vitest](https://vitest.dev/), [@vue/test-utils](https://test-utils.vuejs.org/) & [JSDOM](https://github.com/jsdom/jsdom)
* **Bundler & Dev Server:** [Vite](https://vitejs.dev/)

---

## ✨ Características Principales

* 🔒 **Autenticación Protegida:** Rutas privadas respaldadas por guardias de navegación en Vue Router (\`requiresAuth\`) y manejo de sesión mediante Pinia.
* 👥 **Gestión CRUD de Usuarios:** Lista, crea, edita y elimina registros de usuarios consumiendo una API REST.
* 🔍 **Búsqueda Reactiva en Tiempo Real:** Filtrado dinámico insensible a mayúsculas por nombre o correo electrónico.
* 📄 **Paginación Dinámica:** Paginador reactivo adaptado al total de registros o a los resultados filtrados de la búsqueda.
* 📊 **Exportación a Excel:** Generación automática de reportes \`.xlsx\` en el cliente con los datos actuales de la tabla/búsqueda.
* 🧪 **Pruebas Unitarias:** Cobertura de componentes de formulario, almacenamiento local (\`localStorage\`) y manejo de eventos mediante Vitest y JSDOM.

---

## 🚀 Requisitos Previos

Asegúrate de contar con lo siguiente instalado en tu entorno local:

* [Node.js](https://nodejs.org/) (Versión 18.x o superior recomendada)
* **npm** o **yarn**

---

## 🔧 Instalación y Configuración

1. **Instalar dependencias:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Iniciar el servidor de desarrollo:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Abre tu navegador e ingresa a \`http://localhost:5173\` (o el puerto indicado en la consola).

---

## 📜 Scripts Disponibles

En el proyecto puedes ejecutar los siguientes comandos:

| Comando | Descripción |
| :--- | :--- |
| \`npm run dev\` | Inicia el servidor de desarrollo con Hot Reload mediante Vite. |
| \`npm run build\` | Compila y optimiza la aplicación para entorno de producción en \`/dist\`. |
| \`npm run preview\` | Previsualiza localmente la compilación de producción. |
| \`npm run test\` | Ejecuta la suite de pruebas unitarias con Vitest y JSDOM. |

---

## 🧪 Pruebas Unitarias (Testing)

Las pruebas están construidas usando **Vitest** + **JSDOM** y se encargan de validar:

* Renderizado correcto del DOM.
* Validaciones de formularios y manejo de entradas vacías.
* Persistencia simulada en \`localStorage\`.
* Redirecciones de ruta tras operaciones exitosas.
* Interceptación de diálogos modales de SweetAlert2.

Para ejecutar los tests en modo observador (*watch mode*):
\`\`\`bash
npm run test
\`\`\`

---

## 📁 Estructura del Proyecto

\`\`\`text
frontend/
├── public/
├── src/
│   ├── assets/          # Estilos globales y recursos estáticos
│   ├── components/      # Componentes reutilizables (Navbar, Tabla, etc.)
│   ├── router/          # Configuración de Vue Router y guardias globales
│   ├── stores/          # Tiendas de Pinia (Auth Store, etc.)
│   ├── views/           # Vistas principales (Login, ListarUsuarios, CrearUsuario, EditarUsuario)
│   │   └── __tests__/   # Pruebas unitarias de componentes (.spec.js)
│   ├── App.vue          # Componente Raíz
│   └── main.js          # Punto de entrada principal
├── package.json
├── vite.config.js
└── README.md
\`\`\`

---

## 📝 Licencia

Este proyecto es de código abierto y se distribuye bajo la licencia **MIT**.