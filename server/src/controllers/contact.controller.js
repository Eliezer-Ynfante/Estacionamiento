const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configurar transporter de correo
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

// Función para registrar logs de correos
const logContactMessage = (data, status) => {
    const logDir = path.join(__dirname, '../../logs');
    const logFile = path.join(logDir, 'contact-messages.log');
    
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${status} - ${data.email} - ${data.asunto}\n`;
    
    fs.appendFileSync(logFile, logEntry);
};

/**
 * Enviar correo de contacto
 * POST /api/contact
 */
const enviarContacto = async (req, res) => {
    try {
        const { nombre, apellido, email, asunto, mensaje } = req.body;

        // Template de correo para el administrador
        const htmlAdmin = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
                    Nuevo Mensaje de Contacto
                </h2>
                
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>De:</strong> ${nombre} ${apellido}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Asunto:</strong> ${asunto}</p>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-PE')}</p>
                </div>

                <h3 style="color: #333;">Mensaje:</h3>
                <p style="white-space: pre-wrap; background-color: #fff; padding: 15px; border-left: 4px solid #f97316;">
                    ${mensaje}
                </p>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                    <p>Este es un mensaje automático. Por favor, responde directamente al email del remitente.</p>
                </div>
            </div>
        `;

        // Template de correo de confirmación para el usuario
        const htmlUsuario = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #f97316;">Estacionamiento</h1>
                </div>

                <h2 style="color: #333;">¡Hemos recibido tu mensaje!</h2>
                
                <p>Hola ${nombre},</p>
                
                <p>Gracias por ponerte en contacto con nosotros. Hemos recibido tu mensaje y nos pondremos en contacto contigo muy pronto.</p>

                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Detalles de tu mensaje:</h3>
                    <p><strong>Asunto:</strong> ${asunto}</p>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-PE')}</p>
                    <p><strong>Referencia:</strong> ${Date.now()}</p>
                </div>

                <p>Nuestro equipo revisará tu consulta y te responderá lo antes posible.</p>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                    <p>
                        <strong>Estacionamiento</strong><br>
                        Av. Principal 1234, Lima, Perú<br>
                        Teléfono: +51 (1) 2345-6789<br>
                        Horario: Lun - Vie: 8am - 6pm
                    </p>
                </div>
            </div>
        `;

        // 1. Enviar correo al administrador
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.CONTACT_EMAIL || 'contacto@estacionamiento.local',
            subject: `[CONTACTO] ${asunto}`,
            html: htmlAdmin,
            replyTo: email
        });

        // 2. Enviar correo de confirmación al usuario
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Hemos recibido tu mensaje - Estacionamiento',
            html: htmlUsuario
        });

        // Registrar en log
        logContactMessage({ nombre, apellido, email, asunto }, 'ENVIADO');

        res.status(201).json({
            success: true,
            mensaje: 'Tu mensaje ha sido enviado exitosamente',
            referencia: Date.now()
        });

    } catch (error) {
        console.error('Error al enviar correo de contacto:', error);
        
        // Registrar error en log
        logContactMessage(req.body, `ERROR: ${error.message}`);

        // Responder con error apropiado
        res.status(500).json({
            success: false,
            mensaje: 'Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente más tarde.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    enviarContacto
};
