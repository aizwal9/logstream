package com.logstream.processing.scheduler;

import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;

@Component
@Slf4j
public class MetricsScheduler {

    @Resource
    private SimpMessagingTemplate messagingTemplate;
    @Resource
    private StringRedisTemplate stringRedisTemplate;

    private static final String KEY_TOTAL_CHANGES = "metrics:total_changes";
    private static final String KEY_BOT_CHANGES = "metrics:bot_changes";
    private static final String KEY_WIKI_CHANGES = "metrics:wiki_changes";

    private static final String WEBSOCKET_TOPIC_METRICS = "/topic/metrics";


    @Scheduled(fixedRate = 2000)
    public void broadcastMetrics() {
        try {
            long totalChanges = fetchFromRedis(KEY_TOTAL_CHANGES);
            long botChanges = fetchFromRedis(KEY_BOT_CHANGES);
            long humanChanges = totalChanges - botChanges;
            Map<Object, Object> wikiCounts = stringRedisTemplate.opsForHash().entries(KEY_WIKI_CHANGES);

            Map<String, Object> metrics = Map.of(
                    "totalChanges", totalChanges,
                    "botChanges", botChanges,
                    "humanChanges", humanChanges,
                    "wikiCounts", wikiCounts
            );

            messagingTemplate.convertAndSend(WEBSOCKET_TOPIC_METRICS, metrics);
            log.trace("Broadcasted metrics: {}", metrics);
        } catch (Exception ex) {
            log.error("Error fetching or broadcasting metrics", ex);
        }
    }

    private long fetchFromRedis(String key) {
        return Optional.ofNullable(stringRedisTemplate.opsForValue().get(key))
                .map(Long::parseLong)
                .orElse(0L);
    }

}
