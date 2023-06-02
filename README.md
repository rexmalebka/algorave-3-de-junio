# Algorave 3 de Junio
Emilio Ocelotl x rexmalebka

## how to 

install dependencies

> npm install 

build project

> npm run build

run http server, OSC server and Socket io server for dev implementation

> npm run dev 

## OSC server 

runs on port 3000, collects history text messages into Objects

example:

```json
{
    "rexmalebka": "hello world",
    "anon": "Hi"
}
```

for named hists, send:

| Address  |  Author | Hist | 
|---| --- | -- |
| \hist | \rexmalebka | Hello world |

```Supercollider
n.sendMsg(\hist, \rexmalebka,"Hello world")
```


Anonymous histories: 

| Address  |  Hist | 
|---| --- | 
| \hist |  Hello world |


```Supercollider
n.sendMsg(\hist, "Hello world")
```

## Socket server

runs on port 3030, emit the messages to web clients


| Event Name |  Hist Object | 
|---| --- | 
| hist |  { [author:string] : string} |

```javascript
 socket.on('hist', function (hist_obj) {
        console.debug(hist_obj)
 }
```

## web server

`http-server` runs on an available port, so please check logs to see where will be allocated, you are free to run your own static server to server on `static/`

## other OSC messages

Control bloom strength

| Address  | strenght  | 
|---| --- |
| \bloom |  0.1 |

scene background feedback texture offset

| Address  | offset x  |  offset y  | 
|---| --- | --- |
| \fboffset |  0.1 | 0.1 |

scene background feedback texture rotation

| Address  | rotation | 
|---| --- | 
| \fbrotation |  0.1 | 


