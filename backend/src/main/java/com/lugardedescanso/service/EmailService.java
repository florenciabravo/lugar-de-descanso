package com.lugardedescanso.service;

import com.lugardedescanso.entity.Host;
import com.lugardedescanso.entity.Product;
import com.lugardedescanso.entity.Reservation;
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

    public void sendReservationConfirmation(String to, String fullName, Reservation reservation) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Confirmación de tu reserva en Lugar de Descanso");
            helper.setText(buildReservationHtml(fullName, reservation), true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo de confirmación de reserva", e);
        }
    }

    private String buildReservationHtml(String fullName, Reservation reservation) {
        Product product = reservation.getProduct();
        Host host = product.getHost();

        return "<div style='font-family: Arial, sans-serif; color: #7c7052;'>" +
                "<h2 style='color: #7c7052;'>¡Tu reserva está confirmada! 🎉</h2>" +
                "<p style='color:#7c7052;'>Hola <strong>" + fullName + "</strong>,</p>" +
                "<p style='color:#7c7052;'>Gracias por reservar con nosotros. Aquí están los detalles:</p>" +
                "<ul style='color:#7c7052;'>" +
                "<li><b style='color:#7c7052;'>Producto:</b> " + product.getName() + "</li>" +
                "<li><b style='color:#7c7052;'>Ubicación:</b> " + product.getLocation().getCity() + ", " + product.getLocation().getCountry() + "</li>" +
                "<li><b style='color:#7c7052;'>Check-in:</b> " + reservation.getCheckInDate() + "</li>" +
                "<li><b style='color:#7c7052;'>Check-out:</b> " + reservation.getCheckOutDate() + "</li>" +
                "<li><b style='color:#7c7052;'>Teléfono del proveedor:</b> " + host.getPhoneNumber() + "</li>" +
                "</ul>" +
                "<p style='margin-top:20px; color:#7c7052;'>Nos alegra tenerte con nosotros 😊</p>" +
                "<p style='color:#7c7052;'><i>Equipo de Lugar de Descanso</i></p>" +
                "</div>";
    }
}
