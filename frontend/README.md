# Lugar de Descanso 🏡🌿

![Logo Lugar de Descanso](./frontend/src/assets/LogoLD.png)


**Lugar de Descanso** es una aplicación web de reservas de hospedajes que permite a los usuarios encontrar y reservar **Hoteles**, **Casas de Campo**, **Departamentos**, **Hostels**, **Chacras** y **Cabañas**, enfocándose en la **disponibilidad** y **comodidad** del servicio.

## 🌟 Definición del Proyecto

Este proyecto tiene como objetivo desarrollar una solución integral de reservas para alojamientos turísticos en distintas ubicaciones del país, brindando al usuario una experiencia confiable, intuitiva y visualmente armoniosa.  
La plataforma permite a los dueños de hospedajes publicar sus propiedades, y a los usuarios buscarlas, ver detalles y gestionar sus reservas.

### ⚙️ Stack Tecnologico

- **Backend**: Java con Spring Boot — desarrollo de una API REST robusta.
- **Frontend**: React — interfaz moderna, responsive y fácil de usar.

## 🧩 Tecnologías Utilizadas

### 🔙 Backend

- **Java** — Lenguaje principal del servidor.
- **Spring Boot** — Framework para crear aplicaciones Java robustas y escalables.
- **Spring Web** — Para la creación de controladores REST.
- **JPA (Java Persistence API)** — Para la gestión de la persistencia con entidades.
- **H2 Database** — Base de datos en memoria para desarrollo y pruebas rápidas.
- **JUnit 5** - Framework de testing para pruebas de integracion y unidad.

### 🔜 Frontend

- **JavaScript** — Lenguaje principal del cliente.
- **React** — Librería para construir interfaces de usuario dinámicas.
- **Vite** — Herramienta de construcción rápida y moderna para proyectos React.
- **Bootstrap** — Framework CSS para diseño responsive y componentes visuales.

---

## 🎨 Identidad Visual

### 📌 Logo de la Marca

El siguiente logo representa la identidad de *Lugar de Descanso*. Simboliza el descanso, la ubicación, y una experiencia relajante y natural:

![Logo Lugar de Descanso](./frontend/src/assets/LogoLD.png)

> _“Nos inspiramos en la tierra, el agua y el verde de la naturaleza para transmitir una experiencia de relax sin importar el lugar que elijas del planeta.”_

### 🌈 Paleta de Colores

| Color        | Código Hex | Descripción              |
|--------------|------------|--------------------------|
| Tierra       | `#7c7052`  | Conexión con la tierra, naturaleza y tranquilidad. |
| Aqua         | `#77d4b6`  | Refrescante, representa el agua y la paz. |
| Verde        | `#9eb48e`  | Equilibrio, armonía con el entorno. |
| Off Blanco   | `#F8F9FA`  | Neutral, suave y elegante. |
| Blanco       | `#FFFFFF`  | Pureza y limpieza visual. |

---

## 🛠️ Instrucciones de Instalación

Seguí estos pasos para ejecutar el proyecto en tu entorno local:

1. **Cloná este repositorio** en tu máquina local:
    ```bash
    git clone https://github.com/florenciabravo/lugar-de-descanso.git
    ```

2. **Abre una terminal** y navega hasta la carpeta del proyecto.
    ```bash
    cd backend
    ```
3. **Levanta el servidor backend** ejecutando el siguiente comando:
    ```bash
    ./mvnw spring-boot:run
    ```

4. En **otra terminal**, navega hasta la carpeta frontend dentro del proyecto.
    ```bash
    cd frontend
    ```

5. **Instala las dependencias del frontend** ejecutando el siguiente comando:
    ```bash
    npm install
    ```

6. **Levanta el servidor frontend** ejecutando el siguiente comando:
    ```bash
    npm run dev
    ```

Una vez que hayas seguido estos pasos, podrás acceder a la aplicación en tu navegador ingresando la siguiente URL:
👉 http://localhost:5173

---

## 🧪 Testing

### ✅ Planificación y ejecución de pruebas funcionales

Durante el Sprint 1, 2, 3 y 4 se realizó un proceso formal de validación funcional mediante:

- [Plan de Casos de Prueba - Sprint 1](/docs/Plan-de-Casos-de-Prueba-Sprint1.pdf)

- [Ejecución de Casos de Prueba - Sprint 1](/docs/Ejecucion-de-Casos-de-Prueba-Sprint1.pdf)

- [Plan de Casos de Prueba - Sprint 2](/docs/Plan-de-Casos-de-Prueba-Sprint2.pdf)

- [Ejecución de Casos de Prueba - Sprint 2](/docs/Ejecucion-de-Casos-de-Prueba-Sprint2.pdf)

- [Plan de Casos de Prueba - Sprint 3](/docs/Plan-de-Casos-de-Prueba-Sprint3.pdf)

- [Ejecución de Casos de Prueba - Sprint 3](/docs/Ejecucion-de-Casos-de-Prueba-Sprint3.pdf)

- [Plan de Casos de Prueba - Sprint 4](/docs/Plan-de-Casos-de-Prueba-Sprint4.pdf)

- [Ejecución de Casos de Prueba - Sprint 4](/docs/Ejecucion-de-Casos-de-Prueba-Sprint4.pdf)

Los documentos detallan los escenarios validados manualmente en base a las historias de usuario y criterios de aceptación definidos.

---

### 🔍 Pruebas de Integración

El proyecto incluye un conjunto de **pruebas de integración en el backend** desarrolladas con **JUnit5**, **Spring Boot Test**, **MockMvc** y base de datos **H2 en memoria**, las cuales validan el correcto funcionamiento de los endpoints relacionados con productos.

📁 **Ubicación:**  
`src/test/java/com/lugardedescanso/controller/ProductControllerTest.java`

📌 **Casos cubiertos:**
-  Agregar producto con imágenes válidas.  
-  Intento de agregar un producto con nombre duplicado.  
-  Intento de agregar un producto sin imágenes (error esperado).  
-  Obtener producto por ID (caso exitoso).  
-  Obtener todos los productos.  
-  Eliminar un producto existente y verificar que fue eliminado.

Estas pruebas aseguran la estabilidad y confiabilidad del sistema en los flujos CRUD principales del módulo de productos.

---

## 🚀 Funcionalidades por Sprint

### 🧱 Sprint 1 - Estructura básica y funcionalidades iniciales

Durante el Sprint 1 se desarrollaron las siguientes historias de usuario:

- #1: Colocar encabezado
- #2: Definir el cuerpo del sitio
- #3: Registrar producto
- #4: Visualizar productos aleatorios en el Home  
- #5: Visualizar detalle de producto 
- #6: Visualizar galería de imágenes
- #7: Colocar pie de página
- #8: Paginar productos
- #9: Panel de administración
- #10: Listar productos en el panel de administración  
- #11: Eliminar producto desde el panel  

Se sentaron las bases del diseño responsive, navegación y estructura visual (header, body, footer), y se conectó el frontend con el backend mediante API REST. También se realizaron pruebas manuales y tests de integración para validar los endpoints relacionados a productos.

---

### 🚀 Sprint 2 - Nuevas funcionalidades avanzadas

Durante el Sprint 2 se implementaron las siguientes historias de usuario:

- #12: Categorizar productos  
- #13: Registrar usuario  
- #14: Identificar usuario (login)  
- #15: Cerrar sesión  
- #16: Identificar administrador  
- #17: Administrar características de productos  
- #18: Visualizar características del producto  
- #19: Notificación por correo tras registro  
- #20: Crear sección visual de categorías  
- #21: Agregar nueva categoría  

Cada funcionalidad fue integrada, probada y validada con sus respectivos casos de prueba funcionales y pruebas de integración.

---

### 🚀 Sprint 3 - Nuevas funcionalidades avanzadas

Durante el Sprint 3 se implementaron las siguientes historias de usuario:

- #22: Realizar búsqueda  
- #23: Visualizar disponibilidad  
- #24: Marcar como favorito
- #25: Listar productos favoritos
- #26: Ver bloque de políticas del producto
- #27: Redes, Compartir productos
- #28: Puntuar producto
- #29: Eliminar categoría

En este Sprint se priorizó mejorar la experiencia del usuario mediante la búsqueda avanzada, gestión de favoritos, visualización de políticas y la posibilidad de compartir productos en redes sociales, además de la funcionalidad de puntuación para enriquecer la evaluación de los hospedajes. 

---

### 🚀 Sprint 4 - Funcionalidad de Reserva de Productos y comunicación con el anfitrión

Durante el Sprint 4 se implementaron las siguientes historias de usuario:

- #30: Reservas: Seleccionar fecha
- #31: Reservas: Visualizar detalles
- #32: Realizar reserva
- #33: Acceder a historial
- #34: WhatsApp: Iniciar chat
- #35: Notificacion: Confirmar reserva por correo

Este sprint consolidó el objetivo principal de la plataforma: permitir a los usuarios buscar, visualizar y reservar hospedajes de forma segura y comunicarse con el anfitrión. Las funcionalidades fueron testeadas con validaciones funcionales.

---

## 🔗 Demo en vivo

Próximamente en Netlify

---

## 📌 Backlog Técnico y Próximos Pasos

El proyecto fue desarrollado en base a historias de usuario planificadas por sprints. Todas las funcionalidades definidas en cada historia han sido implementadas, validadas y testeadas.

Actualmente se ha creado un **backlog técnico** con tareas de mejora continua, entre ellas:

- Refactorización y optimización del código en frontend y backend.
- Incorporación de más tests automatizados (unitarios y de integración).
- Deploy automático con variables por entorno para frontend y backend.
- Implementación de roles avanzados para usuarios y mejoras en seguridad.
- Panel de usuario con gestión más detallada de reservas, favoritos y calificaciones.
- Soporte multilenguaje e internacionalización de la interfaz.

> 🛠️ El proyecto continuará evolucionando con foco en calidad, usabilidad y escalabilidad.

---

## 🙏 Agradecimientos

Quiero agradecer especialmente a mis profesores y tutores de **Digital House** por su dedicación, guía y acompañamiento a lo largo de este proceso de formación.  
Su apoyo fue clave para que este proyecto pudiera desarrollarse con compromiso, profundidad técnica y orientación profesional.

---

## 👨‍💻 Desarrollado por

- Florencia Bravo ✨ - Linkedin https://www.linkedin.com/in/florencia-bravo-novillo/  
Proyecto Final - Software Developer 
Año: 2025

---