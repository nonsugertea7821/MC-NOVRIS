package com.github.nonsugertea7821.novris.common.auth.dto.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

/**
 * 認証/プロパティ。
 *
 * @author nonsugertea7821
 * @version 1.0
 * @since 2025/08/16
 */
@Data
@ConfigurationProperties(prefix = "auth")
public class AuthProperties {
    /** 平文パスワード */
    private String password;
    /** nonce(一時salt)の有効時間 */
    private long nonceExpireSeconds;
    /** Jwtトークンのシークレットキー */
    private String jwtSecret;
    /** Jwtトークンの有効時間 */
    private long jwtExpireSeconds;
}