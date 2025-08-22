package com.github.nonsugertea7821.novris.apps.auth.dto.response;

import lombok.Data;

@Data
public class LoginResponse {
    /** Jwtトークン */
    private final String jwtToken;
    /** エラーメッセージ */
    private String errorMessage;
}
