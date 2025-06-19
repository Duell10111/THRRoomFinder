package com.kospaeth.roomfinder

import com.lemonappdev.konsist.api.KoModifier
import com.lemonappdev.konsist.api.Konsist
import com.lemonappdev.konsist.api.ext.list.withNameEndingWith
import com.lemonappdev.konsist.api.verify.assertTrue
import org.junit.jupiter.api.Test

class GeneralTest {

    @Test
    fun `DTO classes should be data classes`() {
        Konsist
            .scopeFromProject()
            .classes()
            .withNameEndingWith("DTO")
            .assertTrue { it.hasModifier(KoModifier.DATA) }
    }

}
