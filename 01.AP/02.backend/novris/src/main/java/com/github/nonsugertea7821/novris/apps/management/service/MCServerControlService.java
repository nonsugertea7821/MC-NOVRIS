package com.github.nonsugertea7821.novris.apps.management.service;

import java.io.IOException;

import org.springframework.stereotype.Service;

import com.github.nonsugertea7821.novris.apps.management.dto.config.MCServerConfiguration;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MCServerControlService {

    private final MCServerConfiguration configuration;

    public void bootMcServer() throws IOException {
        try {
            new ProcessBuilder("java", "-jar", configuration.getJarPath())
                    .directory(new java.io.File(configuration.getDataPath()))
                    .start();
        } catch (IOException e) {
            throw new RuntimeException("サーバー起動失敗", e);
        }
    }

}
