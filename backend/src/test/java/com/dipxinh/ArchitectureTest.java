
package com.dipxinh;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ArchitectureTest {

    @Test
    void shouldVerifyModuleBoundaries() {
        var modules = ApplicationModules.of(DipXinhApplication.class);

        modules.verify();

        int count = 0;
        for (var module : modules) {
            System.out.println(module);
            count++;
        }

        assertEquals(12, count,
            "Expected 12 DịpXinh application modules");
    }
}
