const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Middleware de logging para todas las peticiones
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// Ruta principal
app.get('/', (req, res) => {
    console.log('[INFO] Acceso a la ruta principal');
    res.json({
        message: 'API de Instagram Automation',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        endpoints: {
            '/api/process-instagram': 'POST - Procesar datos de Instagram'
        }
    });
});

// Ruta de health check para Render
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Ruta para procesar datos de Instagram
app.post('/api/process-instagram', async (req, res) => {
    const requestId = Date.now().toString();
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] [${requestId}] Iniciando procesamiento de solicitud`);
    console.log(`[${timestamp}] [${requestId}] Body recibido:`, JSON.stringify(req.body, null, 2));

    try {
        const { nombre_usuario_deseado, solicitud_biografia, publico_objetivo } = req.body;

        console.log(`[${timestamp}] [${requestId}] Validando campos requeridos...`);

        // Validar que todos los campos requeridos estén presentes
        if (!nombre_usuario_deseado || !solicitud_biografia || !publico_objetivo) {
            console.log(`[${timestamp}] [${requestId}] ❌ Validación fallida - Campos faltantes`);
            console.log(`[${timestamp}] [${requestId}] Campos recibidos:`, {
                nombre_usuario_deseado: !!nombre_usuario_deseado,
                solicitud_biografia: !!solicitud_biografia,
                publico_objetivo: !!publico_objetivo
            });

            return res.status(400).json({
                error: 'Faltan campos requeridos',
                required: ['nombre_usuario_deseado', 'solicitud_biografia', 'publico_objetivo']
            });
        }

        console.log(`[${timestamp}] [${requestId}] ✅ Validación exitosa - Todos los campos presentes`);
        console.log(`[${timestamp}] [${requestId}] Preparando prompt para ChatGPT...`);

        // Prompt para ChatGPT
        const prompt = `
Actuás como un experto en marketing digital con experiencia en redes sociales, especialmente en Instagram. Tu rol será el de community manager estratégico.

Siempre que te proporcione los siguientes datos:
- Nombre de usuario deseado: ${nombre_usuario_deseado}
- Qué quiere expresar la biografía: ${solicitud_biografia}
- A quién va dirigida la cuenta (público objetivo): ${publico_objetivo}

Tu tarea será analizar esta información y devolver siempre una respuesta estructurada en el siguiente FORMATO JSON:

{
  "sugerencias_usuario": [
    "nombre_creativo_1",
    "nombre_creativo_2",
    "nombre_creativo_3",
    "nombre_creativo_4",
    "nombre_creativo_5"
  ],
  "biografias": [
    "Primera opción de biografía impactante",
    "Segunda opción de biografía impactante"
  ],
  "publico_objetivo": "Descripción clara del público objetivo, incluyendo segmentación si es necesaria.",
  "recomendaciones_comunidad": [
    "Consejo 1 sobre cómo interactuar con ese público.",
    "Consejo 2 sobre cómo comunicar con ese público.",
    "Consejo 3 sobre cómo generar comunidad con ese público."
  ]
}

Respondé SIEMPRE en este formato, sin ninguna explicación adicional.
`;

        console.log(`[${timestamp}] [${requestId}] Prompt preparado, llamando a OpenAI...`);
        console.log(`[${timestamp}] [${requestId}] Modelo: gpt-4o-mini`);
        console.log(`[${timestamp}] [${requestId}] Temperature: 0.7`);
        console.log(`[${timestamp}] [${requestId}] Max tokens: 1000`);

        // Llamada a OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Eres un experto en marketing digital y community management para Instagram."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        console.log(`[${timestamp}] [${requestId}] ✅ Respuesta recibida de OpenAI`);
        console.log(`[${timestamp}] [${requestId}] Tokens utilizados:`, completion.usage);
        console.log(`[${timestamp}] [${requestId}] Procesando respuesta...`);

        // Extraer la respuesta de ChatGPT
        const response = completion.choices[0].message.content;

        console.log(`[${timestamp}] [${requestId}] Respuesta raw de ChatGPT:`, response.substring(0, 200) + '...');

        // Intentar parsear la respuesta como JSON
        try {
            console.log(`[${timestamp}] [${requestId}] Intentando parsear respuesta como JSON...`);
            const jsonResponse = JSON.parse(response);
            console.log(`[${timestamp}] [${requestId}] ✅ JSON parseado exitosamente`);
            console.log(`[${timestamp}] [${requestId}] Enviando respuesta al cliente...`);
            res.json(jsonResponse);
            console.log(`[${timestamp}] [${requestId}] ✅ Solicitud completada exitosamente`);
        } catch (parseError) {
            console.log(`[${timestamp}] [${requestId}] ❌ Error al parsear JSON:`, parseError.message);
            console.log(`[${timestamp}] [${requestId}] Respuesta completa que no se pudo parsear:`, response);
            // Si no se puede parsear como JSON, devolver la respuesta como texto
            res.json({
                error: "No se pudo parsear la respuesta como JSON",
                raw_response: response
            });
            console.log(`[${timestamp}] [${requestId}] ⚠️ Enviando respuesta con error de parsing`);
        }

    } catch (error) {
        console.error(`[${timestamp}] [${requestId}] ❌ Error en el procesamiento:`, error);
        console.error(`[${timestamp}] [${requestId}] Stack trace:`, error.stack);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
        console.log(`[${timestamp}] [${requestId}] ❌ Solicitud fallida`);
    }
});

// Manejo de errores global
app.use((err, req, res, next) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ Error global:`, err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message
    });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🚀 Servidor iniciado`);
    console.log(`[${timestamp}] 📍 Puerto: ${PORT}`);
    console.log(`[${timestamp}] 🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[${timestamp}] 🏠 Host: 0.0.0.0`);
    console.log(`[${timestamp}] 📊 Health Check: /health`);
    console.log(`[${timestamp}] 📍 API Endpoint: /api/process-instagram`);
    console.log(`[${timestamp}] ✅ Estado: Listo para recibir peticiones`);

    // Verificar configuración de OpenAI
    if (process.env.OPENAI_API_KEY) {
        console.log(`[${timestamp}] ✅ OpenAI API Key configurada`);
    } else {
        console.log(`[${timestamp}] ⚠️ ADVERTENCIA: OpenAI API Key no configurada`);
        console.log(`[${timestamp}] 💡 Configura OPENAI_API_KEY en las variables de entorno de Render`);
    }
});

// Manejo de señales de terminación
process.on('SIGINT', () => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}]  Recibida señal SIGINT, cerrando servidor...`);
    process.exit(0);
});

process.on('SIGTERM', () => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}]  Recibida señal SIGTERM, cerrando servidor...`);
    process.exit(0);
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}]  Error no capturado:`, error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] 💥 Promesa rechazada no manejada:`, reason);
    process.exit(1);
}); 