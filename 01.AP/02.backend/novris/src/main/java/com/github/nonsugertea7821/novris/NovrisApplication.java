package com.github.nonsugertea7821.novris;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class NovrisApplication {
	public static void main(String[] args) {
		SpringApplication.run(NovrisApplication.class, args);
	}
}
