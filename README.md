# TaskManager

Frontend (Angular + Angular Material)

---

# 1.Puesta en marcha
  1.Clonar el repositorio y acceder a la carpeta del frontend:
    git clone <url-del-repositorio>
    cd task-manager

  O alternativamente, trabajar directamente sobre esta carpeta en local.

# 2.Instalar dependencias
  npm install

# 3.Configuración
  El frontend está configurado para consumir la API en:
    http://localhost:3000/api/tasks

  Asegúrate de que el backend esté en ejecución antes de iniciar la aplicación.

# 4.Levantar la aplicación
  npm run start

  La aplicación estará disponible en:
    http://localhost:4200

---

# Funcionalidades
La aplicación permite:

  Crear nuevas tareas
  Visualizar el listado de tareas
  Editar tareas existentes
  Marcar tareas como completadas o pendientes
  Eliminar tareas

Todas las operaciones están conectadas con la API del backend y persisten en base de datos.

# NOTAS
Es necesario que el backend esté en ejecución para el correcto funcionamiento.
La aplicación utiliza Angular Material para la interfaz de usuario.
Se emplea Reactive Forms para la gestión de formularios.
La comunicación con el backend se realiza mediante HttpClient.

# NOTA INFORMATIVA
Se podría usar un .env en el frontend para no exponer la URL de la API, pero al ser un localhost se ha dejado así para simplificar.
