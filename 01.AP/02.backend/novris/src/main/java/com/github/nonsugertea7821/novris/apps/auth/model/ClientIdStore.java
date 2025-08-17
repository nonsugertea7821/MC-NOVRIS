package com.github.nonsugertea7821.novris.apps.auth.model;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

/**
 * クライアント識別子を製造・保管する。
 *
 * @author nonsugertea7821
 * @version 1.0
 * @since 2025/08/16
 */
@Component
@RequiredArgsConstructor
public class ClientIdStore {

    public String createClientId() {
        // TODO ファイルサーバーにクライアントIdを追加・管理する
        return new String("testClient");
    }
}
