package com.kospaeth.roomfinder.config

import com.kospaeth.roomfinder.data.entities.Source
import io.r2dbc.postgresql.codec.EnumCodec
import io.r2dbc.spi.Option
import org.springframework.boot.autoconfigure.r2dbc.ConnectionFactoryOptionsBuilderCustomizer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.r2dbc.convert.EnumWriteSupport
import org.springframework.data.r2dbc.convert.R2dbcCustomConversions
import org.springframework.data.r2dbc.dialect.PostgresDialect


@Configuration
class R2DBCConfig{

    @Bean
    fun customConversions(): R2dbcCustomConversions {
        val converters = mutableListOf(SourceConverter())
        return R2dbcCustomConversions.of(PostgresDialect.INSTANCE, converters)
    }

    @Bean
    fun connectionFactoryOptionsAdapter(): ConnectionFactoryOptionsBuilderCustomizer {
        return ConnectionFactoryOptionsBuilderCustomizer {
            it.option(Option.valueOf("extensions"), listOf(
                EnumCodec.builder().withEnum("Source", Source::class.java).build()))
        }
    }

}

class SourceConverter : EnumWriteSupport<Source>() {
}
