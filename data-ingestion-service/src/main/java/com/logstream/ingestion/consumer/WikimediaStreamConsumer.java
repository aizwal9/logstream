package com.logstream.ingestion.consumer;

import com.logstream.ingestion.config.KafkaTopicConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class WikimediaStreamConsumer {

    private final WebClient webClient;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private static final String WIKIMEDIA_STREAM_URL = "https://stream.wikimedia.org/v2/stream/recentchange";

    public WikimediaStreamConsumer(WebClient.Builder webClientBuilder, KafkaTemplate<String, String> kafkaTemplate) {
        this.webClient = webClientBuilder.baseUrl(WIKIMEDIA_STREAM_URL).build();
        this.kafkaTemplate = kafkaTemplate;
    }

    public void consumeAndPublish() {
        log.info("Connecting to wikimedia sse stream...");

        webClient.get()
                .retrieve()
                .bodyToFlux(DataBuffer.class)
                .map(dataBuffer -> {
                    String chunk = dataBuffer.toString(StandardCharsets.UTF_8);
                    DataBufferUtils.release(dataBuffer);
                    return chunk;
                })
                .concatMap(chunk -> {
                    List<String> lines = Arrays.stream(chunk.split("\n")).toList();
                    return Flux.fromIterable(lines);
                })
                .filter(line -> line.startsWith("data:"))
                .map(line -> line.substring(5).trim())
                .filter(json -> !json.isEmpty())
                .doOnNext(jsonData -> {
                    log.info("Received event data: {}", jsonData);
                    kafkaTemplate.send(KafkaTopicConfig.WIKIMEDIA_TOPIC, jsonData)
                            .whenComplete((result, ex) -> {
                                if (ex != null) {
                                    log.error("Failed to send message to Kafka", ex);
                                } else {
                                    log.trace("successfully sent message to topic {} partition {}",
                                            result.getRecordMetadata().topic(), result.getRecordMetadata().partition());
                                }
                            });
                })
                .doOnError(error -> log.error("Error on wikimedia stream", error))
                .doOnComplete(() -> log.warn("Wikimedia stream completed unexpectedly"))
                .subscribe();
    }

    @Bean
    public ApplicationRunner runner() {
        return args -> consumeAndPublish();
    }

}
