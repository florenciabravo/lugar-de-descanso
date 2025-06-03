package com.lugardedescanso.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendRegistrationConfirmation(String to, String username, String loginUrl) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Confirmacion de Registro");
            helper.setText(buildHtmlContent(username, to, loginUrl), true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo de confirmacion", e);
        }
    }

    private String buildHtmlContent(String username, String email, String loginUrl) {
        return "<h2>¡Registro exitoso!</h2>" +
                "<p>Hola <b>" + username + "</b>, gracias por registrarte en Lugar de Descanso.</p>" +
                "<p>Tu correo: <b>" + email + "</b></p>" +
                "<p>Puedes iniciar sesión haciendo clic en el siguiente enlace:</p>" +
                "<a href=\"" + loginUrl + "\">Iniciar sesión</a>";
    }
}
