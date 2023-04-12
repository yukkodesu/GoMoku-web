# GoMoku Web

<div align="center"> 
    <div style="display:grid;grid-template-columns: repeat(2, 1fr);grid-template-rows: repeat(2, 1fr);align-content:center;justify-item:center;width:fit-content;height:fit-content;border-radius:5px;overflow:hidden;">
        <img style="border-right: 1px solid #242424;border-bottom: 1px solid #242424;" src="https://raw.githubusercontent.com/yukkodesu/GoMoku-web/main/GoMoku-Client/src/assets/blackStone.webp"/>
        <img style="border-left: 1px solid #242424;border-bottom: 1px solid #242424;" src="https://raw.githubusercontent.com/yukkodesu/GoMoku-web/main/GoMoku-Client/src/assets/blackStone.webp"/>
        <img style="border-right: 1px solid #242424;border-top: 1px solid #242424;" src="https://raw.githubusercontent.com/yukkodesu/GoMoku-web/main/GoMoku-Client/src/assets/whiteStone.webp"/>
        <img style="border-top: 1px solid #242424;border-left: 1px solid #242424;" src="https://raw.githubusercontent.com/yukkodesu/GoMoku-web/main/GoMoku-Client/src/assets/noStone.webp"/>
    </div>
    <p style="margin-top:20px;">A GoMoku Web Game implemented in Vite & React & Express </p>
</div>

## About

<div align="center">
    <img align="center" src="https://raw.githubusercontent.com/yukkodesu/GoMoku-web/main/Pics/play.png" width="400"/>
</div>


## Run Demo

Change `localhost` to your ip in network in `ws://localhost:5173/api` at `GoMoku-Client/src/App.tsx: Line 42`

```javascript
const ws = new WebSocket("ws://localhost:5173/api");
wsRef.current = ws;
```

### Run Client

```shell
cd ./GoMoku-Client
pnpm install
pnpm run dev --host
```

### Run Server

```shell
cd ./GoMoku-Server
pnpm install
pnpm run dev
```
and open Browser at `http://<your-ip>:5173`

