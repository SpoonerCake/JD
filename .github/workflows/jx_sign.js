# This workflow will do a clean install of node dependencies, build the source code and run tests across different versions of node
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions

name: jx_sign

on:
  workflow_dispatch:
  schedule:
    - cron: '7 16 * * *'
  watch:
    types: started
  repository_dispatch:
    types: jx_sign
jobs:
  build:

    runs-on: ubuntu-latest
    if: github.event.repository.owner.id == github.event.sender.id
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          repository: zero205/JD
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - name: Cache node_modules
        uses: actions/cache@v2 # 使用 GitHub 官方的缓存 Action。
        env:
          cache-name: cache-node-modules
        with:
          path: node_modules
          key: ${{ runner.os }}-${{ env.cache-name }}-${{ hashFiles('package-lock.json') }} # 使用 package-lock.json 的 Hash 作为缓存的 key。也可以使用 package.json 代替
      - name: npm install
        run: |
          npm install
      - name: Set up Python 3.7
        uses: actions/setup-python@v2
        with:
          python-version: 3.7
      - name: '运行【随机延时】'
        run: |
          python3 sjys.py
      - name: '运行 【京喜签到】'
        run: |
          node jx_sign.js
        env:
          JD_COOKIE: ${{ secrets.JD_COOKIE }}
          PUSH_PLUS_TOKEN: ${{ secrets.PUSH_PLUS_TOKEN }}
          PUSH_PLUS_USER: ${{ secrets.PUSH_PLUS_USER }}
          IGOT_PUSH_KEY: ${{ secrets.IGOT_PUSH_KEY }}
          QYWX_KEY: ${{ secrets.QYWX_KEY }}
          QYWX_AM: ${{ secrets.QYWX_AM }}
          JD_DEBUG: ${{ secrets.JD_DEBUG }}
          PUSH_KEY: ${{ secrets.PUSH_KEY }}
          BARK_PUSH: ${{ secrets.BARK_PUSH }}
          BARK_SOUND: ${{ secrets.BARK_SOUND }}
          TG_BOT_TOKEN: ${{ secrets.TG_BOT_TOKEN }}
          TG_USER_ID: ${{ secrets.TG_USER_ID }}
          DD_BOT_TOKEN: ${{ secrets.DD_BOT_TOKEN }}
          DD_BOT_SECRET: ${{ secrets.DD_BOT_SECRET }}
