# API de Instagram Automation

API REST para procesar datos de Instagram con ChatGPT y generar sugerencias de marketing digital.

## 🚀 Deployment en Render

### 1. Preparación del Repositorio

1. Sube tu código a GitHub
2. Asegúrate de que todos los archivos estén incluidos:
   - `server.js`
   - `package.json`
   - `.gitignore`
   - `README.md`

### 2. Configuración en Render

1. Ve a [Render.com](https://render.com) y crea una cuenta
2. Haz clic en "New +" y selecciona "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura el servicio:

**Configuración básica:**
- **Name**: `instagram-automation-api`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free` (para pruebas)

**Variables de entorno:**
- `OPENAI_API_KEY`: Tu API key de OpenAI
- `NODE_ENV`: `production`

### 3. Variables de Entorno en Render

En la sección "Environment" de tu servicio en Render, agrega:

```
OPENAI_API_KEY=sk-tu-api-key-de-openai-aqui
NODE_ENV=production
```

### 4. Despliegue

1. Haz clic en "Create Web Service"
2. Render construirá y desplegará automáticamente tu aplicación
3. La URL será algo como: `https://tu-app.onrender.com`

##  Uso de la API

### Endpoint: POST /api/process-instagram

**URL:** `https://tu-app.onrender.com/api/process-instagram`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre_usuario_deseado": "ejemplo_usuario",
  "solicitud_biografia": "Quiero expresar que soy un experto en tecnología",
  "publico_objetivo": "Profesionales de IT y emprendedores tecnológicos"
}
```

**Respuesta:**
```json
{
  "sugerencias_usuario": [
    "tech_expert_2024",
    "digital_innovator",
    "tech_leader_pro",
    "innovation_hub",
    "tech_mastermind"
  ],
  "biografias": [
    "🚀 Experto en tecnología | Transformando ideas en soluciones digitales | #TechInnovation #DigitalTransformation",
    " Tech Leader | Ayudando empresas a digitalizarse | Consultoría IT | Speaker"
  ],
  "publico_objetivo": "Profesionales de IT, emprendedores tecnológicos y empresas en proceso de transformación digital",
  "recomendaciones_comunidad": [
    "Comparte contenido técnico y casos de éxito para establecer autoridad",
    "Interactúa con otros expertos del sector para ampliar tu red profesional",
    "Organiza webinars o lives sobre tendencias tecnológicas"
  ]
}
```

### Endpoints adicionales:

- **GET /** - Información de la API
- **GET /health** - Health check para Render

##  Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu API key

# Iniciar en desarrollo
npm run dev

# Iniciar en producción
npm start
```

## 📊 Monitoreo

- Los logs aparecerán en la consola de Render
- Puedes ver los logs en tiempo real en el dashboard de Render
- El endpoint `/health` te permite verificar el estado del servicio

## 🛠️ Tecnologías

- Node.js 18+
- Express.js
- OpenAI API
- CORS
- dotenv

## 📝 Notas importantes

- Render asignará automáticamente el puerto a través de `process.env.PORT`
- El servicio gratuito de Render puede tardar en "despertar" si no ha recibido peticiones recientes
- Para producción, considera usar un plan de pago para mejor rendimiento

## **Cambios principales para Render:**

1. **Host binding**: Cambié `app.listen(PORT)` por `app.listen(PORT, '0.0.0.0')` para que funcione en Render
2. **Health check**: Agregué el endpoint `/health` que Render necesita para monitorear el servicio
3. **Variables de entorno**: Optimicé para usar las variables de entorno de Render
4. **Logs mejorados**: Agregué información del ambiente y host
5. **package.json**: Agregué la sección `engines` para especificar la versión de Node.js
6. **README**: Instrucciones específicas para deployment en Render

Ahora tu API estará lista para desplegar en Render. Solo necesitas:

1. Subir el código a GitHub
2. Crear el servicio en Render
3. Configurar la variable de entorno `OPENAI_API_KEY`
4. ¡Listo! Tu API estará disponible en la URL que te proporcione Render 