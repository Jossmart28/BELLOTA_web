# 🚀 Guía de Despliegue en Azure Static Web Apps

El Panel Web de Bellota está construido con **Next.js 14 (App Router)** y puede ser desplegado de manera óptima utilizando **Azure Static Web Apps** que ofrece soporte nativo (híbrido) para aplicaciones Next.js.

## 🛠️ Requisitos Previos
1. Una cuenta de Microsoft Azure y un repositorio en GitHub o Azure DevOps.
2. La API en Python (FastAPI) desplegada y con CORS habilitado para el dominio web resultante.

## 📦 Pasos de Despliegue

### 1. Preparar el Repositorio
Asegúrate de que el código generado (carpeta `bellota-web`) esté subido a tu repositorio de control de versiones.

### 2. Crear Recurso en Azure
1. Ve al [Portal de Azure](https://portal.azure.com/).
2. Busca y selecciona **Static Web Apps** y haz clic en **Create**.
3. Configuración Básica:
   - **Suscripción:** Tu suscripción activa.
   - **Resource Group:** Selecciona el mismo que usa la API (ej: `rg-bellota`).
   - **Name:** `stapp-bellota-web-prod`.
   - **Plan type:** `Standard` (Recomendado para producción de Next.js SSR/ISR, aunque `Free` funciona para SSG).
   - **Region:** Selecciona la misma región de tu backend.

### 3. Conectar al Repositorio
1. En Source details, selecciona **GitHub** (o tu proveedor).
2. Autoriza y selecciona tu **Organización**, **Repositorio** y **Rama** (ej. `main`).

### 4. Configurar el Build
En la sección *Build Details*:
- **Build Presets:** Next.js
- **App location:** `/` (o la ruta donde esté el código de next.js dentro de tu repo, ej: `/bellota-web`).
- **Api location:** (Déjalo en blanco ya que el backend de FastAPI es un App Service independiente).
- **Output location:** (Generalmente en blanco para Next.js, por defecto toma `.next`).

### 5. Variables de Entorno
1. Después del despliegue exitoso, ve al recurso de *Static Web App* creado.
2. Navega a **Configuration > Environment variables**.
3. Añade la URL del backend FastAPI de producción:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://bellota-api.azurewebsites.net` (Ejemplo)

### 6. Configurar CORS en FastAPI (Importante)
Asegúrate de configurar el middleware de CORS en la API FastAPI para permitir peticiones desde el dominio de Azure Static Web App.

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ambitious-plant-0a1b2c3d.azurestaticapps.net" # <- Tu dominio en Azure Static Web App
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🔄 Integración Continua (CI/CD)
Azure Static Web Apps generará automáticamente un archivo de flujo de trabajo de GitHub Actions (`.github/workflows/azure-static-web-apps-*.yml`). Cada `git push` a la rama `main` compilará y desplegará la web de forma automática.
