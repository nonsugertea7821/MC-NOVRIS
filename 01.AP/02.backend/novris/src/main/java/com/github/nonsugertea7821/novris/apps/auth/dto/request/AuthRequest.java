package com.github.nonsugertea7821.novris.apps.auth.dto.request;

import lombok.Data;

/**
 * 認証/リクエスト。
 *
 * @author nonsugertea7821
 * @version 1.0
 * @since 2025/08/16
 */
@Data
public class AuthRequest {
    /** クライアント識別子 */
    private final String clientId;
    /** 非平文パスワード */
    private final String passwordHash;
}
