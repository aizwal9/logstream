package com.logstream.processing.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.logstream.processing.model.WikimediaChange;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaConsumerService {

    @Resource
    private ObjectMapper objectMapper;
    @Resource
    private MetricsService metricsService;
    @Resource
    private SimpMessagingTemplate messagingTemplate;

    @Value("${spring.kafka.consumer.group-id}")
    private static String group_id;

    private static final String KAFKA_TOPIC = "wikimedia.recentchange";
    private static final String WEBSOCKET_TOPIC_CHANGES = "/topic/recentchanges";

    /**
     * Listens for messages on the Kafka topic.
     *
     * @param message The raw message string from Kafka.
     */
    @KafkaListener(topics = KAFKA_TOPIC, groupId = "${spring.kafka.consumer.group-id}")
    public void consume(String message) {
        log.info("Consumed message -> {}", message);

        try {
            WikimediaChange change = objectMapper.readValue(message, WikimediaChange.class);
            metricsService.updateMetrics(change);
            messagingTemplate.convertAndSend(WEBSOCKET_TOPIC_CHANGES, message);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

}
