package com.lugardedescanso;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class ActiveProfileTest {

    @Autowired
    private Environment environment;

    @Test
    void shouldUseTestProfile() {
        String[] activeProfiles = environment.getActiveProfiles();
        assertTrue(activeProfiles.length > 0, "No hay perfiles activos");
        assertEquals("test", activeProfiles[0], "El perfil activo no es 'test'");
    }
}
