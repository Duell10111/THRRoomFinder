package com.kospaeth.roomfinder

import org.springframework.core.io.ClassPathResource
import kotlin.io.encoding.Base64

fun loadClassFileContent(path: String): String {
    ClassPathResource(path).inputStream.use {
        return String(it.readAllBytes())
    }
}

fun String.base64Encode(): String {
    return Base64.encode(this.encodeToByteArray())
}

fun String.base64Decode(): String {
    return Base64.decode(this.encodeToByteArray()).decodeToString()
}
