package com.github.nonsugertea7821.novris.common.auth.dto.response;

import lombok.Data;

@Data
public class LoginResponse {
    /** Jwtトークン */
    private final String jwtToken;
    /** エラーメッセージ */
    private String errorMessage;
}
