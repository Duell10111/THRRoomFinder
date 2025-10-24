package com.kospaeth.roomfinder

import org.springframework.core.io.ClassPathResource

fun loadClassFileContent(path: String): String {
    ClassPathResource(path).inputStream.use {
        return String(it.readAllBytes())
    }
}
