package com.github.nonsugertea7821.novris.common.auth.dto.response;

import lombok.Data;

/**
 * 認証/チャレンジレスポンス。
 *
 * @author nonsugertea7821
 * @version 1.0
 * @since 2025/08/16
 */
@Data
public class ChallengeResponse {
    /** 一時salt */
    private final String nonce;
}
