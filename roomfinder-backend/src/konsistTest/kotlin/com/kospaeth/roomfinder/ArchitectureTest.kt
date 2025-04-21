package com.kospaeth.roomfinder

import com.lemonappdev.konsist.api.Konsist
import com.lemonappdev.konsist.api.architecture.KoArchitectureCreator.assertArchitecture
import com.lemonappdev.konsist.api.architecture.Layer
import org.junit.jupiter.api.Test

class ArchitectureTest {
    @Test
    fun `clean architecture layers have correct dependencies`() {
        Konsist
            .scopeFromProject()
            .assertArchitecture {
                val controller = Layer("Controller", "com.kospaeth.roomfinder.controller..")
                val service = Layer("Service", "com.kospaeth.roomfinder.service..")
                val persistence = Layer("Persistence", "com.kospaeth.roomfinder.data..")

                // Define architecture assertions
                controller.dependsOn(service)
                service.dependsOn(persistence)
                persistence.dependsOnNothing()
            }
    }
}
