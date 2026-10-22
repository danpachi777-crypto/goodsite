# goodsite

静的サイトは `dist/` にあります。`dist/` をドキュメントルートとして配信してください。

## 回転しながら組み立てるオープニング（01 アトリエ）

編集するファイルは `src/atelier-3d.js` です。Three.js と、独立したドア・エンジン・ホイール等を持つ立体モデルで描画します。

```sh
npm ci
npm run build
```

生成先は `dist/atelier-3d.js` です。確認ページは `/openings.html?opening=atelier`、サイトへの接続は `/?opening=atelier` です。

組み立ては3秒。元の部品の開始順序を保ち、約148度回転した後に横向きで停止します。再生位置は共通の `CarOpening` が管理し、3D描画も同じ時間を使います。モデルとシェーダーの準備完了後に時計が進みます。シーン切り替え時は描画資源を解放します。WebGLを利用できない場合は写真素材の組み立てへ戻ります。

3Dモデルの出典・変更内容・ライセンスは `dist/credits.html` に記載しています。モデルは Car Concept（Khronos glTF Sample Assets / © 2024 Darmstadt Graphics Group GmbH、Eric Chadwick、CC BY 4.0）。元モデルのテクスチャを除き、形状をDraco圧縮、配色を変更しています。配布元のロゴは使用していません。
