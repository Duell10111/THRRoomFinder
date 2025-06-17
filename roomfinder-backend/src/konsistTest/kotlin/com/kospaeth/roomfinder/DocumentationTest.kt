package com.kospaeth.roomfinder

import com.lemonappdev.konsist.api.Konsist
import com.lemonappdev.konsist.api.ext.koscope.declarationsOf
import com.lemonappdev.konsist.api.provider.KoKDocProvider
import com.lemonappdev.konsist.api.verify.assertTrue
import org.junit.jupiter.api.Test

class DocumentationTest {
    // Inspired from:
    // https://docs.konsist.lemonappdev.com/inspiration/snippets/library-snippets

    @Test
    fun `every api declaration has KDoc`() {
        Konsist
            .scopeFromPackage("..controller..", null, "main")
            .declarationsOf<KoKDocProvider>()
            .assertTrue { it.hasKDoc }
    }

    @Test
    fun `every service endpoint has KDoc`() {
        Konsist
            .scopeFromPackage("..service..", null, "main")
            .declarationsOf<KoKDocProvider>()
            .assertTrue { it.hasKDoc }
    }
}
