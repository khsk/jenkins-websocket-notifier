# jenkins-websocket-notifier

(両者の違いがわからないため、ジョブもプロジェクトもまとめてプロジェクトと呼んでいます)

# About

[WebSocketPlugin]を追加したJenkinsからビルド通知を受け取り、トレイ通知でお知らせする、
Electron製のデスクトップアプリです

# 動作検証環境

Windwos7 64bit

# 事前準備

プラグインの管理
`http://yourjenkins:8080/pluginManager/`
から

[WebSocketPlugin]:http://d.hatena.ne.jp/mzp/20110612/jenkins
をインストール

!(https://raw.githubusercontent.com/khsk/jenkins-websocket-notifier/master/readme-images/jwsp.JPG)

システムの設定
`http://yourjenkins:8080/configure`
からWebSocketPluginの設定(任意)

![](https://raw.githubusercontent.com/khsk/jenkins-websocket-notifier/master/readme-images/jwsps.JPG)

各プロジェクトのビルド後の処理でWebsocketNotifierを追加
`http://yourjenkins:8080/job/yourprojectname/configure`

![](https://raw.githubusercontent.com/khsk/jenkins-websocket-notifier/master/readme-images/jwspab.JPG)

# 特徴

JenkinsのWebSocketServerに接続し、ビルド通知を待ち受ける常駐型アプリです。

* ビルドの開始、結果をトレイバルーンで通知します
* アプリ起動後のビルド結果のログをアプリから参照できます
 * ログのビルド番号をクリックすることで、ブラウザでそのビルドのURLを開きます
* 通知を受けたいプロジェクト、ビルド結果種別のみを登録することでフィルタリングが可能です
* ビルド結果の種別を英語音声で通知することが可能です
* ビルド結果によりトレイのアイコンが変化します

# Screenshot

![](https://raw.githubusercontent.com/khsk/jenkins-websocket-notifier/master/readme-images/screenshot.jpg)

![](https://raw.githubusercontent.com/khsk/jenkins-websocket-notifier/master/readme-images/screenshot_failure.JPG)

# 注意点

アプリ起動時はWebSockerServerに自動的に接続しようとしますが、初回起動時は
`ws://localhost:8081/jenkins`
に接続しようとします。
外部にJenkinsを立てている場合は接続失敗のアラートが表示されますが、
正しいドメインとポート番号の登録後は以後、前回登録した内容で自動接続を行います。

![](https://raw.githubusercontent.com/khsk/jenkins-websocket-notifier/master/readme-images/firstrun.jpg)
