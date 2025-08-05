import React from "react";
import "../styles/PoliticaDePrivacidad.css";

export const PoliticaDePrivacidad = () => {
    return (
        <div className="privacy-container">
            <h1>Política de Privacidad</h1>
            <p>Última actualización: 31 de julio de 2025</p>

            <section>
                <h2>1. Introducción</h2>
                <p>
                    En <strong>Lugar de Descanso</strong>, valoramos y respetamos tu
                    privacidad. Esta Política de Privacidad explica cómo recopilamos,
                    usamos y protegemos tu información personal cuando usás nuestra
                    plataforma.
                </p>
            </section>

            <section>
                <h2>2. Información que recopilamos</h2>
                <ul>
                    <li>Datos personales: nombre, correo electrónico, contraseña.</li>
                    <li>Información de uso: reservas, favoritos, búsquedas recientes.</li>
                    <li>
                        Información de contacto opcional para funcionalidades como WhatsApp.
                    </li>
                </ul>
            </section>

            <section>
                <h2>3. Cómo usamos tu información</h2>
                <ul>
                    <li>Para crear y administrar tu cuenta.</li>
                    <li>Para gestionar tus reservas y preferencias.</li>
                    <li>
                        Para enviarte notificaciones importantes o de confirmación.
                    </li>
                    <li>
                        Para mejorar nuestros servicios y brindarte una mejor experiencia.
                    </li>
                </ul>
            </section>

            <section>
                <h2>4. Compartir tu información</h2>
                <p>
                    No compartimos tu información personal con terceros, excepto cuando es
                    necesario para brindarte el servicio (por ejemplo, para contactar a
                    anfitriones o enviar correos de confirmación).
                </p>
            </section>

            <section>
                <h2>5. Seguridad y privacidad en WhatsApp</h2>
                <p>
                    Algunas funcionalidades permiten compartir productos por WhatsApp.
                    Esta acción es opcional y se realiza voluntariamente desde el navegador del usuario.
                    No almacenamos ni accedemos a tus conversaciones de WhatsApp.
                    <br /><br />
                    Al utilizar WhatsApp, aceptás que la comunicación se realiza a través de una
                    plataforma externa operada por Meta Platforms, Inc., y queda sujeta a sus{" "}
                    <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                         políticas de privacidad
                    </a>.
                </p>
            </section>

            <section>
                <h2>6. Tus derechos</h2>
                <p>
                    Podés acceder, corregir o eliminar tu información personal en cualquier
                    momento desde tu cuenta. Si necesitás ayuda, podés escribirnos al correo
                    de soporte.
                </p>
            </section>

            <section>
                <h2>7. Cambios en esta política</h2>
                <p>
                    Podemos actualizar esta política de privacidad. Te notificaremos en caso
                    de cambios importantes.
                </p>
            </section>

            <section>
                <h2>8. Contacto</h2>
                <p>
                    Si tenés preguntas sobre esta política, escribinos a:
                    <br />
                    <strong>lugardedescanso.info@gmail.com</strong>
                </p>
            </section>
        </div>
    );
};
