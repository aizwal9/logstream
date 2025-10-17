package com.logstream.processing.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class WikimediaChange {

    @JsonProperty("bot")
    private boolean bot;

    @JsonProperty("user")
    private String user;

    @JsonProperty("server_name")
    private String serverName;

    @JsonProperty("type")
    private String type; // e.g., "edit", "categorize", "new"

    @JsonProperty("title")
    private String title;
}
