package com.github.nonsugertea7821.novris.common.auth.model;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import com.github.nonsugertea7821.novris.common.auth.dto.config.AuthProperties;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

/**
 * Jwtトークンを発行する。
 *
 * @author nonsugertea7821
 * @version 1.0
 * @since 2025/08/16
 */
@Component
@RequiredArgsConstructor
public class JwtProcessor {

    private final AuthProperties authProperties;
    private Key key;
    private long expireMillis;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(authProperties.getJwtSecret().getBytes());
        this.expireMillis = authProperties.getJwtExpireSeconds() * 1000;
    }

    public String generateToken(String clientId) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(clientId)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expireMillis))
                .signWith(key)
                .compact();
    }
}
