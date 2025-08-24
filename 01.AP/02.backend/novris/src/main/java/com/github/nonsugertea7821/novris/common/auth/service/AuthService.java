package com.github.nonsugertea7821.novris.common.auth.service;

import java.util.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Service;

import com.github.nonsugertea7821.novris.common.auth.dto.properties.AuthProperties;
import com.github.nonsugertea7821.novris.common.auth.dto.request.AuthRequest;
import com.github.nonsugertea7821.novris.common.auth.dto.request.ChallengeRequest;
import com.github.nonsugertea7821.novris.common.auth.dto.response.ChallengeResponse;
import com.github.nonsugertea7821.novris.common.auth.model.ClientIdStore;
import com.github.nonsugertea7821.novris.common.auth.model.JwtProcessor;
import com.github.nonsugertea7821.novris.common.auth.model.NonceStore;

import jakarta.security.auth.message.AuthException;
import lombok.RequiredArgsConstructor;

/**
 * 認証/サービス機能。
 *
 * @author nonsugertea7821
 * @version 1.0
 * @since 2025/08/16
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthProperties properties;
    private final NonceStore nonceStore;
    private final ClientIdStore clientIdStore;
    private final JwtProcessor jwtProcessor;

    /**
     * 認証/クライアント識別子取得処理
     *
     * @return クライアント識別子
     */
    public String getClientId() {
        return clientIdStore.createClientId();
    }

    /**
     * 認証/チャレンジ取得処理
     *
     * @param request チャレンジリクエスト
     * @return チャレンジ
     */
    public ChallengeResponse requestChallenge(ChallengeRequest req) {
        String nonce = nonceStore.createNonce(req.getClientId());
        return new ChallengeResponse(nonce);
    }

    /**
     * 認証/Jwtトークン取得処理
     *
     * @param req {@link AuthRequest} - リクエスト
     * @return Jwtトークン
     */
    public String authenticate(AuthRequest req) throws AuthException {
        String clientId = req.getClientId();
        String passwordHash = req.getPasswordHash();

        // nonceを取得
        String nonce = nonceStore.getNonce(clientId);
        // nonceからパスワードをハッシュ化
        String expectedHash = AuthService.hmacSha256(nonce, properties.getPassword());
        // パスワードハッシュの有効性を検証
        if (!expectedHash.equals(passwordHash)) {
            throw new AuthException("不正なパスワードです");
        }
        // jwtトークンを返却
        return jwtProcessor.generateToken(req.getClientId());
    }

    /**
     * 一時saltに基づくハッシュ化処理。
     *
     * @param nonce    一時salt
     * @param password 平文パスワード
     * @return nonce毎に一意に決定するハッシュ値
     */
    private static String hmacSha256(String nonce, String password) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(nonce.getBytes("UTF-8"), "HmacSHA256");
            mac.init(secretKey);
            byte[] hmacBytes = mac.doFinal(password.getBytes("UTF-8"));
            String hmacBase64 = Base64.getEncoder().encodeToString(hmacBytes);
            return hmacBase64;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}