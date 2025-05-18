package com.kospaeth.roomfinder.utils

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.reactor.mono
import kotlinx.coroutines.withContext
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

suspend fun <T> Cache.getAllKeysPresent(keys: Collection<String>): Map<String, T> =
    withContext(Dispatchers.IO) {
        when (this@getAllKeysPresent) {
            is CaffeineCache -> {
                val nativeCache = this@getAllKeysPresent.nativeCache
                nativeCache.getAllPresent(keys) as Map<String, T>
            }

            else -> emptyMap()
        }
    }
