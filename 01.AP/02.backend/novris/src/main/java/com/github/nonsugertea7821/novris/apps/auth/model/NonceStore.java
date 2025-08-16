package com.github.nonsugertea7821.novris.apps.auth.model;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import com.github.nonsugertea7821.novris.apps.auth.dto.config.AuthProperties;

import jakarta.security.auth.message.AuthException;
import lombok.RequiredArgsConstructor;

/**
 * nonce(一時salt)を製造・保管する。
 *
 * @author nonsugertea7821
 * @version 1.0
 * @since 2025/08/16
 */
@Component
@RequiredArgsConstructor
public class NonceStore {

    /** 認証プロパティ */
    private final AuthProperties authProperties;

    /**
     * nonceの有効期限保管Map
     * key:nonce
     * value:nonce作成時間
     */
    private final Map<String, Instant> expire = new ConcurrentHashMap<>();

    /**
     * クライアント別nonce保管Map
     * key:clientId
     * value:nonce
     */
    private final Map<String, String> store = new ConcurrentHashMap<>();

    /**
     * クライアント識別子に対応するnonceを製造する。
     *
     * @param clientId クライアント識別子
     * @return nonce
     */
    public String generateNonce(String clientId) {
        String nonce = UUID.randomUUID().toString();
        store.put(clientId, nonce);
        expire.put(nonce, Instant.now());
        return nonce;
    }

    /**
     * クライアント識別子に対応するnonceを取得する。
     *
     * @param clientId クライアント識別子
     * @return nonce
     * @throws AuthException 取得失敗時
     */
    public String getNonce(String clientId) throws AuthException {
        String storedNonce = store.get(clientId);
        store.remove(storedNonce);

        Instant created = expire.get(storedNonce);
        expire.remove(storedNonce);

        if (created == null || storedNonce == null) {
            throw new AuthException("不正なクライアント識別子です");
        }

        boolean valid = Instant.now().isBefore(created.plusSeconds(authProperties.getNonceExpireSeconds()));
        if (!valid) {
            throw new AuthException("認証がタイムアウトしました");
        }

        return storedNonce;
    }
}