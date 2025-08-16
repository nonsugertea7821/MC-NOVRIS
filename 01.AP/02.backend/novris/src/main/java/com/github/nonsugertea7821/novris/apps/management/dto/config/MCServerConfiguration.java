package com.github.nonsugertea7821.novris.apps.management.dto.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@Data
@ConfigurationProperties(prefix = "mc-server")
public class MCServerConfiguration {
    private String jarPath;
    private String dataPath;
}
