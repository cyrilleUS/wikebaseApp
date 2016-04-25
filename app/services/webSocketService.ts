import {Injectable, Component, Inject, provide} from 'angular2/core';
import {$WebSocket} from 'angular2-websocket/angular2-websocket';
import {Http} from 'angular2/http';

@Component({
  providers: [ provide( $WebSocket, { useValue: new $WebSocket("ws://echo.websocket.org") } ) ]
})

@Injectable()
export class WebSocketService {
    constructor( private wsConnection : $WebSocket ) {
        alert("Starting connection");
        this.wsConnection.onClose(this.onCloseHandler);
        this.wsConnection.onError(this.onErrorHandler);
        this.wsConnection.onOpen(this.onOpenHandler);
        this.wsConnection.onMessage(this.onRecieveHandler, {});
    }
    getData(){
        return "Hello";
    }
    send() {
        var msg = {
            author: "wike",
            message: "hi"
        }
        this.sendMessage(JSON.stringify(msg));
        alert("message sent");
    }

    public connect() {
        this.wsConnection.connect(true);
    }

    public disconnect() {
        this.wsConnection.close(false);
    }

    private reconnect() {
        this.wsConnection.reconnect();
    }

    public sendMessage(msg: any) {
        this.wsConnection.send(msg);
    }

    private onRecieveHandler(evt: MessageEvent) {
        alert("Recieved Data From Server\nData: " + evt.data);

    }

    private onErrorHandler(evt: Event) {
        alert("wsConnection error, onErrorHandler"
            + "\nError: " + JSON.stringify(evt));

    }

    private onOpenHandler(evt: Event) {
        alert("Server connected");
    }

    private onCloseHandler(evt: CloseEvent) {
        alert("wsConnection closed, onCloseHandler"
            + evt.code);
    }
}
