\# ED\\\_AUTH\\\_認証モジュール

\## 1. 概要

本モジュールは、クライアントから IP アドレスとパスワードを入力させ、サーバー側認証を経て JWT トークンを取得する \*\*認証モジュール\*\* である。React と Recoil を用いたフロントエンドと、Axios を用いた API 通信により、セキュアかつ効率的なログイン処理を提供する。

---

\## 2. コンポーネント構成

\### 2.1 LoginForm コンポーネント

\* \*\*場所:\*\* `components/login/LoginForm.tsx`
\* \*\*役割:\*\* ユーザーから接続先 IP とパスワードを入力させ、ログイン処理を呼び出すフォーム

\#### 状態管理 (useState)

| 変数名      | 型       | 説明                               |
| -------- | ------- | -------------------------------- |
| targetIp | string  | 接続先サーバーの IP アドレス。変更時にはパスワードをリセット |
| password | string  | ユーザー入力パスワード                      |
| loading  | boolean | ログイン処理中フラグ。true の場合は入力欄・ボタンを無効化  |
| error    | string  | 入力または認証エラー表示                     |

\#### 主な関数

| 関数名                  | 説明                                                                     |
| -------------------- | ---------------------------------------------------------------------- |
| handleTargetIpChange | IP アドレス入力時に state 更新。入力変更時は既存パスワードをリセット                                |
| handlePasswordChange | パスワード入力時に state 更新                                                     |
| handleLoginSubmit    | フォーム送信時に実行。IP/Password の空チェック後、Recoil の login 関数を呼び出す。ログイン成功後にホーム画面へ遷移 |

\#### UI構成

| 要素                   | 詳細                                      |
| -------------------- | --------------------------------------- |
| TextField (IP)       | 接続先 IP 入力欄。入力中に password がリセットされる       |
| TextField (Password) | パスワード入力欄。入力不可状態は loading フラグで制御         |
| Typography           | 入力または認証エラーメッセージ表示。赤文字で表示                |
| Button               | ログインボタン。loading 時はテキストを「ログイン中…」に変更して無効化 |

---

\### 2.2 axiosHelper クラス

\* \*\*場所:\*\* `axios/axiosHelper.ts`
\* \*\*役割:\*\* Axios をラップし、JWT 認証付き HTTP リクエストを統一的に処理する

\#### プロパティ

| プロパティ    | 型      | 説明           |
| -------- | ------ | ------------ |
| ip       | string | 接続先 IP アドレス  |
| jwtToken | string | 認証済 JWT トークン |

\#### メソッド

| メソッド                          | 説明                                               |
| ----------------------------- | ------------------------------------------------ |
| setIp(ip: string)             | 接続先 IP 設定。ベース URL 作成に使用                          |
| setJwtToken(jwtToken: string) | JWT トークン設定。非認証 API へのリクエストで Authorization ヘッダに付与 |
| get/post/put/delete           | 各 HTTP メソッドのラッパー。必要に応じてデータやパラメータを設定              |
| private request               | 共通 Axios リクエスト処理。ベース URL 作成、ヘッダー付与、メソッドごとの処理を統合  |
| private isAuthUrl             | 認証用 URL 判定。JWT が不要な API を識別                      |
| private createDomainURL       | IP + ポートからベース URL 作成。IP 未設定時は undefined を返す      |
| private createRequestHeaders  | JWT を含むヘッダー作成。非認証 API の場合は JWT ヘッダーを付与しない        |

---

\### 2.3 認証 API

\* \*\*場所:\*\* `api/common/auth/authApi.ts`

| 関数            | 役割                    | HTTP メソッド | 詳細                                                           |
| ------------- | --------------------- | --------- | ------------------------------------------------------------ |
| getClientId   | クライアントIDをサーバーから取得     | GET       | 初回ログイン時に呼び出す。Recoil でキャッシュ管理                                 |
| challenge     | ノンスを取得                | POST      | クライアントIDを渡し、ワンタイムノンスを取得。パスワードハッシュ生成に使用                       |
| loginRequest  | パスワードハッシュを送信し JWT を取得 | POST      | clientId と passwordHash を送信。成功時 JWT を返却、失敗時 errorMessage を返す |
| logoutRequest | ログアウト処理               | POST      | JWT をサーバー側で無効化。成功時 resultCode=0                              |

\#### 補助関数

\* `hmacSha256(nonce, password)`

&nbsp; \* HMAC-SHA256 でパスワードをハッシュ化
&nbsp; \* ブラウザの Crypto API を利用

---

\### 2.4 Recoil 状態管理

\#### atom: loginState
```ts
{
&nbsp; clientId?: string;
&nbsp; isAuthenticated: boolean;
}
```
\* ログイン状態を保持。初期値は未認証


\#### selector: clientIdSelector
\* loginState に clientId がない場合、getClientId() を呼び出して取得
\* 取得済みであればキャッシュを使用

\#### selector: authSelector

\* \*\*返却オブジェクト\*\*
```ts
{
&nbsp; clientId: string;
&nbsp; isAuthenticated: boolean;
&nbsp; login: (targetIp: string, password: string) => Promise<void>;
&nbsp; logout: () => Promise<void>;
}
```
\* \*\*login 処理フロー\*\*
&nbsp; 1. axiosHelper.setIp(targetIp) で IP 設定
&nbsp; 2. clientIdSelector から clientId 取得
&nbsp; 3. challenge API 呼び出しで nonce 取得
&nbsp; 4. hmacSha256 で passwordHash 生成
&nbsp; 5. loginRequest API 呼び出し、JWT 取得
&nbsp; 6. JWT を axiosHelper に設定
&nbsp; 7. loginState 更新 (isAuthenticated=true, clientId 設定)

\* \*\*logout 処理フロー\*\*
&nbsp; 1. logoutRequest 呼び出し
&nbsp; 2. 成功時 loginState を reset

---

\## 3. 処理フロー

1\. ユーザーが IP とパスワードを入力
2\. handleLoginSubmit 実行
3\. 入力バリデーション（IP/Password 空チェック）
4\. authSelector.login 呼び出し
5\. AxiosHelper に IP 設定
6\. clientId 取得 (getClientId via selector)
7\. Challenge API 呼び出し、nonce 取得
8\. パスワードハッシュ生成 (hmacSha256)
9\. loginRequest API 呼び出し、JWT 取得
10\. AxiosHelper に JWT 設定
11\. loginState 更新（isAuthenticated = true）
12\. ホーム画面へ遷移

---

\## 4. 例外処理

\* IP またはパスワード未入力時 → error メッセージを画面に表示
\* loginRequest で errorMessage が返却される場合 → DOMException をスロー
\* logoutRequest 失敗時 → loginState は変更されない
