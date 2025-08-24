\# ID\\\_AUTH\\\_認証モジュール

\*\*モジュール名\*\*: 認証（Auth Module）
\*\*作成日\*\*: 2025/08/24
\*\*作成者\*\*: nonsugertea7821

---

\## 1. フォルダ構成

```

com/github/nonsugertea7821/novris/common/auth/
│
├─ controller/
│   └─ AuthController.java            	# REST APIエンドポイント
│
├─ dto/
│   ├─ properties/
│   │   └─ AuthProperties.java       	# 認証設定プロパティ
│   │
│   ├─ request/
│   │   ├─ AuthRequest.java          	# 認証リクエストDTO
│   │   └─ ChallengeRequest.java	# チャレンジリクエストDTO
│   │
│   └─ response/
│       ├─ ChallengeResponse.java    # チャレンジレスポンスDTO
│       └─ LoginResponse.java        	# ログインレスポンスDTO
│
├─ model/
│   ├─ ClientIdStore.java           	# クライアントID管理
│   ├─ JwtProcessor.java             	# JWT発行
│   ├─ JwtAuthenticationFilter.java  # JWT認証フィルター
│   ├─ AuthProperties.java       	# 認証設定プロパティ
│   └─ NonceStore.java               	# nonce管理
│
└─ service/
&nbsp;   └─ AuthService.java              	# 認証ビジネスロジック

```

---

\## 2. モジュール概要

認証モジュールは、クライアント識別子の発行、チャレンジ生成、一時salt（nonce）の管理、パスワード認証およびJWTトークン発行を担当する。
REST APIとしてフロントエンドや他のバックエンドサービスから利用される。

---

\## 3. 機能一覧

| 機能名         | 概要                                | 入力                                  | 出力                                     | 例外                                       |
| ----------- | --------------------------------- | ----------------------------------- | -------------------------------------- | ---------------------------------------- |
| クライアント識別子取得 | サーバーごとに一意のクライアントIDを生成して返却         | なし                                  | String clientId                        | なし                                       |
| チャレンジ取得     | 指定クライアントに対応する一時salt（nonce）を生成     | ChallengeRequest(clientId)          | ChallengeResponse(nonce)               | なし                                       |
| 認証・JWT発行    | クライアントIDとnonceハッシュを検証し、JWTトークンを返却 | AuthRequest(clientId, passwordHash) | LoginResponse(jwtToken / errorMessage) | AuthException（不正なクライアントID、パスワード、または期限切れ） |

---

\## 4. クラス設計

\### 4.1 コントローラー層

\* \*\*AuthController\*\*

&nbsp; REST APIエンドポイントを提供

&nbsp; \* `GET /api/auth/get-clientId` → `getClientId()`
&nbsp; \* `POST /api/auth/challenge` → `getChallenge(ChallengeRequest)`
&nbsp; \* `POST /api/auth/login` → `login(AuthRequest)`

\### 4.2 サービス層

\* \*\*AuthService\*\*

&nbsp; 認証ロジックを実装
&nbsp; \* `getClientId()`：ClientIdStore呼び出し
&nbsp; \* `requestChallenge(ChallengeRequest)`：NonceStore呼び出し
&nbsp; \* `authenticate(AuthRequest)`：Nonce取得 → パスワードハッシュ検証 → JWT発行

\### 4.3 モデル / ドメイン

\* \*\*ClientIdStore\*\*：クライアント識別子の生成・管理
\* \*\*NonceStore\*\*：一時salt（nonce）の生成、期限管理、取得
\* \*\*JwtProcessor\*\*：JWTトークンの生成
\* \*\*JwtAuthenticationFilter\*\*：リクエストからJWTトークンを検証し、SecurityContextに設定

\### 4.4 DTO

\* \*\*AuthRequest\*\*：認証リクエスト (clientId, passwordHash)
\* \*\*ChallengeRequest\*\*：チャレンジリクエスト (clientId)
\* \*\*ChallengeResponse\*\*：チャレンジレスポンス (nonce)
\* \*\*LoginResponse\*\*：JWTレスポンス (jwtToken, errorMessage)
\* \*\*AuthProperties\*\*：認証関連設定 (password, nonceExpireSeconds, jwtSecret, jwtExpireSeconds)

\### 4.5 設定

\* \*\*SecurityConfig\*\*：Spring Security設定

&nbsp; \* JWTフィルター追加
&nbsp; \* CORS設定（フロントエンド: `http://localhost:3000`）
&nbsp; \* CSRF無効化
&nbsp; \* `/api/auth/\*\*` は許可

---

\## 5. フロー設計

\### 5.1 クライアント識別子発行

1\. `GET /api/auth/get-clientId` 呼び出し
2\. `AuthController.getClientId()` → `AuthService.getClientId()` → `ClientIdStore.createClientId()`
3\. クライアントIDを返却

\### 5.2 チャレンジ生成

1\. `POST /api/auth/challenge` 呼び出し（body: clientId）
2\. `AuthController.getChallenge()` → `AuthService.requestChallenge()` → `NonceStore.createNonce(clientId)`
3\. nonceを含む `ChallengeResponse` を返却

\### 5.3 認証およびJWT発行

1\. `POST /api/auth/login` 呼び出し（body: clientId, passwordHash）
2\. `AuthController.login()` → `AuthService.authenticate()`
3\. `NonceStore.getNonce(clientId)` でnonce取得、期限チェック
4\. nonce + 平文パスワード → `hmacSha256` でハッシュ計算
5\. ハッシュ一致 → `JwtProcessor.generateToken(clientId)` でJWT発行
6\. `LoginResponse(jwtToken)` を返却
7\. 不一致・期限切れ → `AuthException` → HTTP 401

---

\## 6. セキュリティ設計

\* JWT署名：HMAC-SHA256、`auth.jwtSecret`
\* JWT有効期限：`auth.jwtExpireSeconds`
\* nonce有効期限：`auth.nonceExpireSeconds`
\* 認証済みリクエストは `JwtAuthenticationFilter` がSecurityContextにセット

---

\## 7. 非機能要件

\* APIレスポンス形式：JSON
\* Spring Boot 3 + Spring Security
\* スレッドセーフ化検討：NonceStore Mapの競合回避
\* ログ出力：不要（現状）

---

\## 8. 将来的改修の想定

\* ClientIdStoreをDBやファイル管理に対応
\* NonceStoreのスレッドセーフ化、キャッシュ戦略
\* JWTリフレッシュトークン対応
\* パスワードハッシュアルゴリズム強化