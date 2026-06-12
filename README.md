
# 📷 Fotaza — Web de fotografías

Trabajo Práctico Integrador — Programación Web II  

URL de producción: **https://fotaza-henna.vercel.app**

---

## 🚀 Instalación y ejecución local

    ### Requisitos previos
    - Node.js v18 o superior
    - PostgreSQL v14 o superior 

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/MarianelaRocamora/Fotaza.git
cd Fotaza

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
#   DATABASE_URL=postgresql://TU_USUARIO:TU_PASSWORD@localhost:5432/fotaza
#   PORT=3000
#   SESSION_SECRET=cualquier_string_secreto

# 4. Inicializar tablas y datos de prueba
npm run db:init

# 5. Iniciar el servidor
npm start
```

La aplicación quedará disponible en: **http://localhost:3000**

---

## ⚙️ Variables de entorno

Crear un archivo `.env` basándose en `.env.example`:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/fotaza
PORT=3000
SESSION_SECRET=fotaza2secret
```

Para desarrollo local con PostgreSQL instalado:
```env
DATABASE_URL=postgresql://postgres:tupassword@localhost:5432/fotaza
PORT=3000
SESSION_SECRET=cualquier_string_secreto
```

---

## 👤 Usuarios de prueba

Luego de ejecutar `npm run db:init`:

| Rol       | Correo          | Contraseña |
|-----------|---------------- |------------|
| Usuario 1 | maria@gmail.com | 456123

> Para la demo en producción registrate en https://fotaza-henna.vercel.app/registro

---

## ✅ Funcionalidades implementadas

### 1. Creación de publicación
- Título obligatorio, descripción opcional
- Una o más imágenes (jpg, png, gif, webp, máx 5MB c/u)
- Etiquetas obligatorias separadas por comas
- Las imágenes se guardan como binario (BYTEA) en PostgreSQL y se sirven como base64

### 2. Buscador de publicaciones
- Filtros combinables: título, etiqueta, autor, licencia, valoración mínima
- Resultados agrupados por publicación ordenados por promedio

### 3. Módulo de comentarios
- Comentarios por imagen
- El autor puede cerrar/abrir comentarios de cada imagen
- Solo usuarios registrados pueden comentar

### 4. Valoración de imágenes
- Escala 1 a 5 estrellas por imagen
- Un usuario no puede votar su propia imagen
- Un usuario no puede votar la misma imagen más de una vez
- Se muestra promedio y cantidad de votos
- Publicaciones con promedio ≥4 y ≥5 votos aparecen en "Destacadas"

### 5. Seguimiento de usuarios
- Seguir / dejar de seguir usuarios
- Perfil muestra cantidad de seguidores y seguidos
- Sección "Publicaciones de usuarios que sigo" en el home
- No se puede seguir a uno mismo ni duplicar el seguimiento

---

## 📋 Endpoints principales

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/registro` | Formulario de registro |
| POST | `/registro` | Crear cuenta |
| GET | `/login` | Formulario de login |
| POST | `/login` | Iniciar sesión |
| GET | `/logout` | Cerrar sesión |
| GET | `/home` | Home principal |

### Publicaciones
| Método | Ruta                      | Descripción                    |
|--------|---------------------------|--------------------------------|
| GET    | `/publicacion/nueva`      | Formulario nueva publicación   |
| POST   | `/publicacion/nueva`      | Crear publicación con imágenes |
| GET    | `/publicacion/:id/editar` | Formulario editar publicación  |
| POST   | `/publicacion/:id/editar` | Guardar cambios                |

### Perfil y seguimiento
| Método | Ruta                          | Descripción           |
|--------|-------------------------------|-----------------------|
| GET    | `/perfil/:id`                 | Ver perfil de usuario |
| POST   | `/perfil/:id/seguir`          | Seguir usuario        |
| POST   | `/perfil/:id/dejar-de-seguir` | Dejar de seguir       |

### Interacciones
| Método | Ruta                                    | Descripción                  |
|--------|-----------------------------------------|------------------------------|
| POST   | `/votar`                                | Votar imagen (1-5 estrellas) |
| POST   | `/comentar`                             | Agregar comentario           |
| POST   | `/imagen/:id/cerrar-comentarios`        | Cerrar comentarios de imagen |
| POST   | `/imagen/:id/abrir-comentarios`         | Abrir comentarios de imagen  |

### Búsqueda
| Método | Ruta      | Descripción                      |
|--------|-----------|----------------------------------|
| GET    | `/buscar` | Buscar publicaciones con filtros |

---

## 📦 Paquetes y librerías

| Paquete             | Versión | Uso en el proyecto |
|---------------------|---------|--------------------|
| **express**         | ^5.2.1  | Framework web principal. Maneja rutas, middlewares y el servidor HTTP |
| **sequelize**      | ^6.37.8 | ORM para PostgreSQL. Se usa en modo híbrido: ORM para operaciones simples y `sequelize.query()` para JOINs complejos con AVG, COUNT y GROUP BY |
| **pg**              | ^8.20.0 | Driver de PostgreSQL requerido por Sequelize para conectarse a la base de datos |
| **pg-hstore**       | ^2.3.4  | Serialización de objetos JSON para PostgreSQL, requerido por Sequelize |
| **pug**             | ^3.0.4  | Motor de plantillas HTML. Todas las vistas del proyecto están en Pug con herencia de layout |
| **multer**          | ^2.1.1  | Middleware para subida de archivos. Se usa con `memoryStorage()` para recibir imágenes como buffer en memoria sin escribir en disco |
| **sharp**           | ^0.34.5 | Procesamiento de imágenes. Lee el buffer de Multer, extrae metadatos (ancho/alto) y aplica marca de agua SVG sobre imágenes con copyright |
| **bcrypt**          | ^6.0.0  | Hash de contraseñas. Se usa con sal de 10 rondas al registrar usuarios y para verificar en el login |
| **express-session** | ^1.19.0 | Manejo de sesiones de usuario. Almacena id, nombre y rol del usuario logueado |
| **connect-pg-simple** | ^10.0.0 | Store de sesiones persistente en PostgreSQL. Necesario en Vercel porque MemoryStore no funciona entre instancias |
| **dotenv**          | ^17.4.2 | Carga variables de entorno desde el archivo `.env` |

---

## 🗄️ Base de datos

**Motor:** PostgreSQL 17  
**Proveedor en producción:** Neon (https://neon.tech)

### Estrategia de consultas (híbrida)
- **ORM Sequelize** (`findOne`, `create`, `update`, `destroy`, `count`) para operaciones simples sobre una sola tabla
- **`sequelize.query()` con raw SQL** para consultas complejas con JOINs múltiples, `AVG`, `COUNT`, `GROUP BY`, `HAVING` y `STRING_AGG`

### Tablas principales

| Tabla                  | Descripción                                                                                      | 
|------------------------|--------------------------------------------------------------------------------------------------|
| `usuario`              | Usuarios registrados con soft delete (`fecha_baja`)                                              |
| `publicacion`          | Publicaciones de los usuarios                                                                    |
| `imagen`               | Imágenes vinculadas a publicaciones. La imagen se guarda como binario en columna `datos` (BYTEA) |
| `etiqueta`             | Etiquetas únicas                                                                                 |
| `publicacion_etiqueta` | Relación N:M entre publicaciones y etiquetas                                                     |
| `voto`                 | Valoraciones 1-5 por imagen (unique por usuario+imagen)                                          |
| `comentario`           | Comentarios por imagen                                                                           | 
| `usuario_seguidor`     | Relación de seguimiento entre usuarios                                                           |
| `denuncia`             | Denuncias sobre imágenes o comentarios                                                           |
| `session`              | Sesiones persistentes de express-session                                                         |

### Restaurar base de datos desde backup

```bash
psql -U postgres -d fotaza < fotaza_backup.sql
```

---

## 🔧 Scripts disponibles

```bash
npm start        # Inicia el servidor en http://localhost:3000
npm run db:init  # Crea las tablas e inserta datos de prueba
```

---

## 🗂️ Estructura del proyecto

```
├── app.js                  # Punto de entrada, configuración de Express y sesiones
├── db/
│   ├── sequelize.js        # Conexión a PostgreSQL con DATABASE_URL y SSL condicional
│   └── init.js             # Inicialización de tablas y datos de prueba
├── models/                 # Modelos Sequelize
│   ├── Usuario.js
│   ├── Publicacion.js
│   ├── Imagen.js           # Incluye columna datos (BYTEA) para almacenamiento binario
│   ├── Comentario.js
│   ├── Voto.js
│   ├── etiqueta.js
│   ├── UsuarioSeguidor.js
│   └── asociaciones.js     # Define todas las relaciones entre modelos
├── controllers/            # Lógica de negocio (MVC)
│   ├── authController.js   # Registro, login, logout, home
│   ├── publicacionController.js  # Crear publicación, Multer memoryStorage + Sharp
│   ├── edicionController.js      # Editar publicación
│   ├── perfilController.js       # Ver perfil, seguir/dejar de seguir
│   ├── busquedaController.js     # Búsqueda con filtros combinables
│   ├── comentarioController.js   # Agregar comentarios
│   ├── votoController.js         # Votar imágenes
│   └── imagenController.js       # Cerrar/abrir comentarios
├── utils/
│   └── imagenHelper.js     # Convierte BYTEA a base64 para mostrar en vistas
├── routes/                 # Definición de rutas Express
├── views/                  # Plantillas Pug
│   ├── layout.pug          # Layout base con navbar
│   ├── home.pug
│   ├── perfil.pug
│   ├── busqueda.pug
│   ├── login.pug
│   ├── registro.pug
│   └── publicacion/
│       ├── nueva.pug
│       └── editar.pug
├── middlewares/
│   └── auth.js             # Middleware soloRegistrados
├── fotaza_backup.sql       # Backup de la base de datos
├── .env.example            # Plantilla de variables de entorno
├── vercel.json             # Configuración de deploy en Vercel
└── package.json
```

---

## ⚠️ Problemas encontrados y soluciones

### 1. `pg` no encontrado en Vercel serverless
Sequelize carga `pg` dinámicamente en runtime. En Vercel serverless el módulo no se incluye automáticamente. **Solución:** agregar `global.pg = require('pg')` al inicio de `app.js` y listar los submódulos de `pg` en `includeFiles` del `vercel.json`.

### 2. Filesystem read-only en Vercel
Multer con `diskStorage` falla en Vercel con `EROFS: read-only file system`. **Solución:** cambiar a `memoryStorage()`, procesar el buffer con Sharp y guardar el binario como BYTEA en PostgreSQL. Al leer, se convierte a base64 con el helper `imagenASrc`.

### 3. Sesiones no persisten entre instancias serverless
`MemoryStore` de express-session no funciona en entornos serverless donde cada request puede ir a una instancia diferente. **Solución:** instalar `connect-pg-simple` y guardar las sesiones en una tabla `session` de Neon.

### 4. Case-sensitivity en Linux (Render/Vercel)
El archivo `models/etiqueta.js` estaba importado como `./Etiqueta` en algunos controllers. Windows no detecta la diferencia . **Solución:** estandarizar todos los imports a minúscula `./etiqueta`.

### 5. `sequelize.sync({ alter: true })` corrompe tablas de unión
Con `alter: true`, Sequelize recrea las tablas N:M borrando todos los datos. **Solución:** usar `sync({ force: false })` y gestionar la creación con `CREATE TABLE IF NOT EXISTS` en `db/init.js`.

### 6. Prefijos duplicados en rutas
`app.use('/votar', votoRoutes)` + `router.post('/votar')` crea la ruta `/votar/votar`. **Solución:** usar `router.post('/')` dentro del router cuando ya se montó con prefijo.

### 7. `\restrict` en backup de pgAdmin
pgAdmin 18 agrega comandos `\restrict` y `\unrestrict` que no son SQL estándar y fallan en Neon. **Solución:** eliminar esas líneas del backup antes de ejecutarlo en Neon.

---

## 🌐 Despliegue en producción

- **Hosting:** Vercel (serverless)
- **Base de datos:** Neon PostgreSQL
- **URL:** https://fotaza-henna.vercel.app
