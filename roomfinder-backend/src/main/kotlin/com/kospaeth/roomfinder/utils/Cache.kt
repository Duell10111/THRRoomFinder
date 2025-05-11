package com.kospaeth.roomfinder.utils

import kotlinx.coroutines.reactive.awaitFirstOrDefault
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.reactor.mono
import org.springframework.cache.Cache
import org.springframework.cache.caffeine.CaffeineCache

suspend inline fun <reified T> Cache.getEntry(key: String): T? {
    return mono {
        get(key, T::class.java)
    }.awaitSingleOrNull()
}

suspend inline fun <reified T> Cache.putEntry(
    key: String,
    value: T?,
) {
    mono {
        put(key, value)
    }.awaitSingleOrNull()
}

suspend inline fun <reified T> Cache.getAllKeysPresent(keys: Collection<String>): Map<String, T> {
    if (this is CaffeineCache) {
        val nativeCache = this.nativeCache
        mono {
            nativeCache.getAllPresent(keys)
        }.awaitFirstOrDefault(emptyMap())
    }
    return emptyMap()
}
