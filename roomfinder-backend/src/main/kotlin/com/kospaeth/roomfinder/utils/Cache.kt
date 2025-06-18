package com.kospaeth.roomfinder.utils

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.reactor.mono
import kotlinx.coroutines.withContext
import org.springframework.cache.Cache
import org.springframework.cache.caffeine.CaffeineCache

/**
 * Retrieves a cached entry by key and casts it to the specified type.
 *
 * This function uses a coroutine and reactive Mono to perform the operation asynchronously.
 *
 * @param key The cache key to retrieve the value for.
 * @return The cached value cast to type [T], or null if not found or type mismatch.
 */
suspend inline fun <reified T> Cache.getEntry(key: String): T? {
    return mono {
        get(key, T::class.java)
    }.awaitSingleOrNull()
}

/**
 * Puts a value into the cache under the specified key.
 *
 * This function uses a coroutine and reactive Mono to perform the operation asynchronously.
 *
 * @param key The key to store the value under.
 * @param value The value to be cached.
 */
suspend inline fun <reified T> Cache.putEntry(
    key: String,
    value: T?,
) {
    mono {
        put(key, value)
    }.awaitSingleOrNull()
}

/**
 * Retrieves all values from the cache that match the given keys.
 *
 * If the cache is backed by Caffeine, this method accesses the native cache directly
 * for efficient bulk access. Otherwise, an empty map is returned.
 *
 * @param keys A collection of keys to look up in the cache.
 * @return A map of keys to cached values of type [T].
 */
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
