# Files Processor Application

## Descripción

Esta es una aplicación fullstack que procesa y visualiza datos de archivos CSV. Consta de dos componentes principales:

1. **Backend (Node.js + Express)**: API que consume un servicio externo para obtener archivos CSV, los procesa y expone endpoints REST.
2. **Frontend (React + Redux)**: Interfaz de usuario que muestra los datos procesados con capacidades de filtrado.

## Tecnologías Utilizadas

### Backend
- Node.js 14+
- Express.js
- Axios para peticiones HTTP
- Mocha + Chai para testing
- Swagger para documentación de API
- JavaScript Standard Style

### Frontend
- React 18
- Redux para gestión de estado
- React Bootstrap para UI
- Jest para testing unitario
- Webpack para bundling

## Requisitos

### Para desarrollo local
- Node.js 14+ (backend)
- Node.js 16+ (frontend)
- npm

### Para despliegue con Docker
- Docker
- Docker Compose

## Ejecución con Docker (Recomendado)

La forma más sencilla de ejecutar la aplicación completa es utilizando Docker Compose:

1. Asegúrate de tener Docker y Docker Compose instalados en tu sistema
2. Clona este repositorio
3. Desde la raíz del proyecto, ejecuta:

```bash
docker-compose up --build
```

Esto iniciará:
- Backend API en http://localhost:3001
- Frontend en http://localhost:3002
- Documentación Swagger en http://localhost:3001/api-docs

Para detener los servicios, presiona `Ctrl+C` en la terminal o ejecuta:

```bash
docker-compose down
```

## Instalación Manual

### Backend

```bash
# Desde el directorio raíz
npm install
npm start
```

La API se iniciará en el puerto 3001.

### Frontend

```bash
# Desde el directorio frontend
cd frontend
npm install
npm start
```

La interfaz de usuario se iniciará en el puerto 3002.

## Estructura del Proyecto

```
/
├── controllers/         # Controladores de la API
├── routes/             # Rutas de la API
├── services/           # Servicios para lógica de negocio
├── test/               # Tests del backend
├── frontend/           # Aplicación React
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── redux/      # Estado global con Redux
│   │   └── __tests__/  # Tests unitarios
├── Dockerfile          # Configuración Docker para backend
├── docker-compose.yml  # Configuración Docker Compose
└── swagger.js          # Configuración de Swagger
```

## API Endpoints

### GET /files/list

Devuelve la lista de archivos disponibles desde la API externa.

Ejemplo de respuesta:
```json
{
  "files": ["test1.csv", "test2.csv", "test3.csv"]
}
```

### GET /files/data

Devuelve datos procesados de los archivos CSV obtenidos de la API externa.

Parámetros de consulta:
- `fileName` (opcional): Filtra resultados por nombre de archivo específico

Ejemplo de respuesta:
```json
[
  {
    "file": "test1.csv",
    "lines": [
      {
        "text": "RgTya",
        "number": 64075909,
        "hex": "70ad29aacf0b690b0467fe2b2767f765"
      }
    ]
  }
]
```

## Funcionalidades Principales

### Backend

1. **Procesamiento de CSV**: Descarga y procesa archivos CSV desde una API externa.
2. **Validación de datos**: Filtra líneas inválidas y archivos vacíos.
3. **Filtrado por archivo**: Permite filtrar datos por nombre de archivo específico.
4. **Documentación Swagger**: API completamente documentada con Swagger UI.
5. **Tests**: Incluye tests unitarios y de integración.

### Frontend

1. **Visualización de datos**: Muestra los datos procesados en un formato tabular.
2. **Filtrado**: Permite filtrar datos por nombre de archivo.
3. **Estado global**: Utiliza Redux para gestionar el estado de la aplicación.
4. **Componentes reutilizables**: Estructura modular con componentes React.
5. **Tests unitarios**: Incluye tests para componentes y lógica de Redux.

## Ejecución de Tests

### Tests del Backend

```bash
# Desde el directorio raíz
npm test
```

### Tests del Frontend

```bash
# Desde el directorio frontend
cd frontend
npm test
```

## Estándares de Código

El proyecto sigue el estándar JavaScript Standard Style para mantener un código limpio y consistente.

## Notas Adicionales

- La API externa requiere un token de autenticación que está configurado en el servicio.
- El frontend se comunica con el backend a través de la URL configurada en las variables de entorno.
- La configuración de Docker está optimizada para desarrollo y puede requerir ajustes para producción.
```

## Project Structure

- `index.js` - Entry point for the application
- `routes/` - API routes
- `controllers/` - Request handlers
- `services/` - Business logic
- `test/` - Test files
