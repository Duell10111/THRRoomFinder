package com.kospaeth.roomfinder

import com.lemonappdev.konsist.api.KoModifier
import com.lemonappdev.konsist.api.Konsist
import com.lemonappdev.konsist.api.ext.list.modifierprovider.withoutModifier
import com.lemonappdev.konsist.api.verify.assertTrue
import org.junit.jupiter.api.Test

class DocumentationTest {
    // Inspired from:
    // https://docs.konsist.lemonappdev.com/inspiration/snippets/library-snippets

//    @Test
//    fun `every api declaration has KDoc`() {
//        Konsist
//            .scopeFromPackage("..controller..", null, "main")
//            .declarationsOf<KoKDocProvider>()
//            .assertTrue { it.hasKDoc }
//    }

    @Test
    fun `every service endpoint has KDoc`() {
        Konsist
            .scopeFromPackage("..service..", null, "main")
            .functions()
            .assertTrue { it.hasKDoc }

        // Assert all classes except data classes has property KDoc
        Konsist
            .scopeFromPackage("..service..", null, "main")
            .classes()
            .withoutModifier(KoModifier.DATA)
            .assertTrue { it.hasKDoc }
    }

    @Test
    fun `every data package has KDoc`() {
        Konsist
            .scopeFromPackage("..data..", null, "main")
            .functions()
            .assertTrue { it.hasKDoc }

        // All classes have property KDoc
        Konsist
            .scopeFromPackage("..data..", null, "main")
            .classes()
            .assertTrue { it.hasKDoc }
    }
}
