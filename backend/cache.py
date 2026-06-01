import time
import logging

logger = logging.getLogger(__name__)

class TTLCache:
    def __init__(self):
        # Format: {key: {"data": data, "timestamp": timestamp, "ttl": ttl}}
        self._cache = {}

    def set(self, key: str, data, ttl_seconds: float):
        self._cache[key] = {
            "data": data,
            "timestamp": time.time(),
            "ttl": ttl_seconds
        }
        logger.debug(f"Cache SET: key={key}, ttl={ttl_seconds}s")

    def get(self, key: str):
        if key not in self._cache:
            return None
        
        entry = self._cache[key]
        now = time.time()
        
        # Check if expired
        if now - entry["timestamp"] > entry["ttl"]:
            logger.debug(f"Cache EXPIRED: key={key} (age={int(now - entry['timestamp'])}s, ttl={entry['ttl']}s)")
            return None
            
        logger.debug(f"Cache HIT: key={key}")
        return entry["data"]

    def get_stale(self, key: str):
        """Returns cached data regardless of whether it's expired or not, for fallback purposes."""
        if key in self._cache:
            logger.debug(f"Cache STALE GET: key={key}")
            return self._cache[key]["data"]
        return None

    def clear(self):
        self._cache.clear()

# Global cache instance
cache_store = TTLCache()
