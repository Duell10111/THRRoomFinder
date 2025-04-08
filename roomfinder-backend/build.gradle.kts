import org.springframework.boot.gradle.plugin.SpringBootPlugin

plugins {
    kotlin("jvm") version "1.9.25"
    kotlin("plugin.spring") version "1.9.25"
    kotlin("kapt") version "1.9.25"
    id("org.springframework.boot") version "3.4.3"
    id("com.google.cloud.tools.jib") version "3.4.4"
    id("com.diffplug.spotless") version "6.25.0"
    id("jacoco")
}

group = "com.kospaeth"
version = "0.0.1-SNAPSHOT" // TODO: Make dynamic to release env?

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring
    implementation(platform(SpringBootPlugin.BOM_COORDINATES))
    annotationProcessor(platform(SpringBootPlugin.BOM_COORDINATES))
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-cache")

    // Spring Extensions
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")

    // Spring Data
    implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
    runtimeOnly("org.postgresql:postgresql")
    implementation("org.postgresql:r2dbc-postgresql") // Implementation needed for Config Adaptions

    // Springdoc
    implementation("org.springdoc:springdoc-openapi-starter-webflux-ui:2.7.0")

    // Mapping
    implementation("org.mapstruct:mapstruct:1.6.0")
    kapt("org.mapstruct:mapstruct-processor:1.6.0")

    // HTML Parser
    implementation("org.jsoup:jsoup:1.19.1")

    // Logging
    implementation("io.github.oshai:kotlin-logging-jvm:7.0.0")

    // Caching
    implementation("com.github.ben-manes.caffeine:caffeine:3.2.0")

    // Tests
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation("io.mockk:mockk:1.13.17")
    testImplementation("org.wiremock:wiremock-standalone:3.12.1")
    testImplementation("io.projectreactor:reactor-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test")
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:postgresql")
    testImplementation("org.testcontainers:r2dbc")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

spotless {
    kotlin {
        ktlint().setEditorConfigPath("./.editorconfig")
    }
}

kapt {
    arguments {
        // Set Mapstruct Configuration options here
        // https://kotlinlang.org/docs/reference/kapt.html#annotation-processor-arguments
        // https://mapstruct.org/documentation/stable/reference/html/#configuration-options
        arg("mapstruct.defaultComponentModel", "spring")
    }
}

tasks.jacocoTestReport {
    reports {
        xml.required.set(true)
        html.required.set(true)
    }
}

// TODO: Add spottless depend when building
