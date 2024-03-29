# アプリケーション名

## interestCity

## アプリケーションの説明

同じ趣味の人が集まってチャットをすることができるサイトです。  
コメントの送信、写真の送信ができます。  
レスポンシブ対応しているので、スマホからもチャットに参加できます。

# 開発環境の立ち上げ

1. 設定ファイル（.env）を生成する

```
cp api/.env.example api/.env
```

2. 親ディレクトリに移動

```
cd ..
```

3. docker イメージを生成する

```
docker-compose build
```

4. docker コンテナを起動する

```
docker-compose up -d
```

5. api フォルダに移動

```
cd api
```

6. migration を実行

```
docker-compose exec api node --require ts-node/register ./node_modules/typeorm/cli.js migration:generate -n Migration
```

7. migration を元に mysql 上に table を作成

```
docker-compose run api yarn migration:run
```

# 使用技術

- nestjs/cli 8.0.0
- socket.io 4.4.1
- nodemailer 6.7.6
- vuetify 2.6.1
- sass-loader 10.1.1
- passport-jwt 4.0.0
- Nuxtjs 2.15.8
- Vuetify 2.6.1
- vue 2.6.1
- docker-compose
- MySQL 5.7
# 機能一覧

- ユーザー登録、ログイン機能
- チャンネル作成機能
- コメント送信機能
- いいね機能
- ブックマーク機能
- チャンネル参加、退出機能
- スレッド送信機能
- チャンネル検索機能
- ジャンル登録機能
- ブックマークしたコメント一覧表示機能
- コメント編集機能
- コメント削除機能
- 写真送信機能
- ユーザープロフィール編集機能
- ユーザープロフィール写真編集機能

# 要件定義

| 機能                          | 機能要件                                                                                                               | 優先度 | 備考                                                                                                                                           |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ユーザー仮登録                | 以下の項目を入力し、ユーザーの仮登録を行う<br>・ユーザー名<br>・メールアドレス<br>・パスワード<br>・パスワードの確認   | ★★★★★  | メールアドレスを使用可能かを判定し、使用可能なら本登録用の URL を記載したメールを送信する。                                                    |
| 本登録用 URL 記載のメール送信 | 仮登録完了後に本登録用のメールを自動で送信する。                                                                       | ★★★★★  | 本登録用の URL の期限は１時間                                                                                                                  |
| 本登録機能                    | 登録されたメールアドレスに送信されたリンクを踏むことでユーザーの本登録を行うことができる                               | ★★★★★  |                                                                                                                                                |
| ユーザープロフィール編集機能  | 以下の情報を追加＆編集できる<br>・ユーザー名<br>・自己紹介<br>・プロフィール写真                                       | ★★★★★  | 自己紹介、プロフィール写真は任意で追加・編集を行える。                                                                                         |
| ログイン機能                  | 以下の項目を入力することでログインすることができる。<br>・メールアドレス<br>・パスワード                               | ★★★★★  | ログイン有効期限は１時間<br>１時間以上経つと再ログインが必要                                                                                   |
| ゲストログイン機能            | ゲストログインすることができる                                                                                         | ★★★★☆  | チャンネルの閲覧、ジャンルごとのチャンネル一覧表示ができる（チャンネルの作成、メッセージの送信、プロフィールの編集、ジャンルの追加はできない） |
| ソーシャルログイン            | 以下のアカウントにてログイン可能<br>・Twitter<br>・Google                                                              | ★☆☆☆☆  |                                                                                                                                                |
| 誤ログイン防止                | 数回ログインに失敗すると 30 分ログインを受け付けない                                                                   | ★★☆☆☆  |                                                                                                                                                |
| チャンネル作成機能            | 以下の情報を入力してチャンネルを作成できる<br>・チャンネル名<br>・チャンネルの説明（任意）<br>・タグの追加（最低３つ） | ★★★★★  |                                                                                                                                                |
| 新規メッセージ通知機能        | 新規メッセージがあればチャンネル部分にメッセージ数を表示                                                               | ★☆☆☆☆  |                                                                                                                                                |
| チャンネル検索機能            | キーワードを入力して、キーワードを含むチャンネルを表示                                                                 | ★★★★★  | チャンネルの参加・退出ができる                                                                                                                 |
| チャンネル退出機能            | 参加中のチャンネルから退出する                                                                                         | ★★★★★  | チャンネル一覧から退出することができる                                                                                                         |
| おすすめチャンネルを表示      | チャンネル一覧にておすすめチャンネルを表示                                                                             | ★☆☆☆☆  |                                                                                                                                                |
| メッセージ送信機能            | 入力したメッセージを送信する                                                                                           | ★★★★★  |                                                                                                                                                |
| メッセージ編集機能            | 送信したメッセージを編集する                                                                                           | ★★★★★  |                                                                                                                                                |
| メッセージ削除機能            | 送信したメッセージを削除する                                                                                           | ★★★★☆  |                                                                                                                                                |
| メッセージ表示                | チャンネルのメッセージを表示する                                                                                       | ★★★★★  | 送信者、送信日時、メッセージを表示する                                                                                                         |
| いいね機能                    | メッセージにいいねする                                                                                                 | ★★★★★  |                                                                                                                                                |
| ブックマーク機能              | メッセージをブックマークする                                                                                           | ★★★★☆  |                                                                                                                                                |
| ブックマーク一覧              | ブックマークしたメッセージを一覧表示する                                                                               | ★★★★☆  |                                                                                                                                                |
| リアルタイムチャット機能      | リアルタイムでチャットをすることができる                                                                               | ★★★★★  |                                                                                                                                                |
| 写真送付機能                  | 写真を送ることができる                                                                                                 | ★★★★★  |                                                                                                                                                |

# DB ER 図

<img src="https://user-images.githubusercontent.com/68439724/186182915-2464bc85-4530-4a1d-83e2-fe11cc5c7035.png"  title="ER図">

# 画面遷移図

画面遷移図の URL を添付します。  

adobeURL:https://xd.adobe.com/view/927a2f26-c071-4a15-b5c0-47897fe8d4a4-c729/

<img src="https://user-images.githubusercontent.com/68439724/186709470-e959a0b8-9237-4374-af9c-726b13e08bda.png" title="画面遷移図">
