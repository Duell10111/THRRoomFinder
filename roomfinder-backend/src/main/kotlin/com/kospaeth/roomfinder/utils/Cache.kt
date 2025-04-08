package com.kospaeth.roomfinder.utils

import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.reactor.mono
import org.springframework.cache.Cache

suspend inline fun <reified T> Cache.getEntry(key: String) : T? {
    return mono {
        get(key, T::class.java)
    }.awaitSingleOrNull()
}

suspend inline fun <reified T> Cache.putEntry(key: String, value: T?) {
    mono {
        put(key, value)
    }.awaitSingleOrNull()
}
