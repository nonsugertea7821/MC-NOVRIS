package com.github.nonsugertea7821.novris.common.auth.model;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.github.nonsugertea7821.novris.common.auth.dto.properties.AuthProperties;

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
    private final Map<String, Instant> expire = new HashMap<String, Instant>();

    /**
     * クライアント別nonce保管Map
     * key:clientId
     * value:nonce
     */
    private final Map<String, String> store = new HashMap<String, String>();

    /**
     * クライアント識別子に対応するnonceを製造する。
     *
     * @param clientId クライアント識別子
     * @return nonce
     */
    public String createNonce(String clientId) {
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
        Instant created = expire.get(storedNonce);
        try {
            if (created == null || storedNonce == null) {
                throw new AuthException("不正なクライアント識別子です");
            }
            if (!Instant.now().isBefore(created.plusSeconds(authProperties.getNonceExpireSeconds()))) {
                throw new AuthException("認証がタイムアウトしました");
            }
        } finally {
            store.remove(storedNonce);
            expire.remove(storedNonce);
        }
        return storedNonce;
    }
}