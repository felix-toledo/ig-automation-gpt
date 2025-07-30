# API de Instagram Automation

API REST para procesar datos de Instagram con ChatGPT y generar sugerencias de marketing digital.

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno:
   - Copia el archivo `.env.example` a `.env`
   - Agrega tu API key de OpenAI en `OPENAI_API_KEY`

3. Inicia el servidor:
```bash
npm start
```

Para desarrollo con auto-reload:
```bash
npm run dev
```

## Uso de la API

### Endpoint: POST /api/process-instagram

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
    "🚀 Tech Leader | Ayudando empresas a digitalizarse | Consultoría IT | Speaker"
  ],
  "publico_objetivo": "Profesionales de IT, emprendedores tecnológicos y empresas en proceso de transformación digital",
  "recomendaciones_comunidad": [
    "Comparte contenido técnico y casos de éxito para establecer autoridad",
    "Interactúa con otros expertos del sector para ampliar tu red profesional",
    "Organiza webinars o lives sobre tendencias tecnológicas"
  ]
}
```

## Variables de Entorno

- `PORT`: Puerto del servidor (default: 3000)
- `OPENAI_API_KEY`: Tu API key de OpenAI

## Tecnologías

- Node.js
- Express.js
- OpenAI API
- CORS
- dotenv 