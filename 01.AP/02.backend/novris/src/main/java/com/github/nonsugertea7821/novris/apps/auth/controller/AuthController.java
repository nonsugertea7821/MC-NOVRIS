package com.github.nonsugertea7821.novris.apps.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.nonsugertea7821.novris.apps.auth.dto.request.AuthRequest;
import com.github.nonsugertea7821.novris.apps.auth.dto.request.ChallengeRequest;
import com.github.nonsugertea7821.novris.apps.auth.dto.response.ChallengeResponse;
import com.github.nonsugertea7821.novris.apps.auth.service.AuthService;

import jakarta.security.auth.message.AuthException;
import lombok.RequiredArgsConstructor;

/**
 * 認証/コントローラー機能。
 *
 * @author nonsugertea7821
 * @version 1.0
 * @since 2025/08/16
 */
@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    /** 認証/サービス機能 */
    private final AuthService service;

    /**
     * 認証/API:サーバー毎に一意のクライアント識別子を取得する。
     *
     * @return クライアント識別子
     */
    @GetMapping("/get-clientId")
    public String getClientId() {
        return service.getClientId();
    }

    /**
     * 認証/API:チャレンジを取得する。
     *
     * @param clientId クライアント識別子
     * @return
     */
    @PostMapping("/challenge")
    public ChallengeResponse getChallenge(@RequestBody ChallengeRequest req) {
        return service.requestChallenge(req);
    }

    /**
     * 認証/API:ログイントークンを発行する。
     *
     * @param req {@link AuthRequest} - リクエスト
     * @return Jwtトークン
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest req) {
        try {
            String token = service.authenticate(req);
            return ResponseEntity.ok(token);
        } catch (AuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}