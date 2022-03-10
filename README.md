## 開発環境の立ち上げ

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

5. apiフォルダに移動
```
cd api
```

6. migration を実行

```
docker-compose exec api node --require ts-node/register ./node_modules/typeorm/cli.js migration:generate -n Migration
```

7. migrationを元にmysql上にtableを作成

```
docker-compose run api yarn migration:run

```
