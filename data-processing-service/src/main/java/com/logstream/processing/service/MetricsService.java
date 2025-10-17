package com.logstream.processing.service;

import com.logstream.processing.model.WikimediaChange;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MetricsService {

    @Resource
    private StringRedisTemplate stringRedisTemplate;
    private static final String KEY_TOTAL_CHANGES = "metrics:total_changes";
    private static final String KEY_BOT_CHANGES = "metrics:bot_changes";
    private static final String KEY_WIKI_CHANGES = "metrics:wiki_changes"; // A Hash for domain counts

    /**
     * Updates all relevant metrics based on an incoming change event.
     *
     * @param change The parsed WikimediaChange event.
     */
    public void updateMetrics(WikimediaChange change) {
        stringRedisTemplate.opsForValue().increment(KEY_TOTAL_CHANGES);

        if (change.isBot()) {
            stringRedisTemplate.opsForValue().increment(KEY_BOT_CHANGES);
        }
        if (change.getServerName() != null) {
            stringRedisTemplate.opsForHash().increment(KEY_WIKI_CHANGES, change.getServerName(), 1);
        }
    }

}
