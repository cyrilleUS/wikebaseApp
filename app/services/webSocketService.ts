import {Injectable, Component, Inject, provide} from 'angular2/core';
//import {$WebSocket} from 'angular2-websocket/angular2-websocket';
import {Http} from 'angular2/http';

import SockJS = require('sockjs-client');
import Stomp = require('stompjs');



import {ChatMessage} from '../models/chatMessage';

let favorites = [],
    domain = "www.valleydesigners.com",
    chatConnectUrl = "/wsMobileApp/ws",
    chatSubscribeUrl = "/topic/message"

@Component({
  //providers: [ provide( $WebSocket, { useValue: new $WebSocket(chatConnectUrl) } ) ]
})

@Injectable()
export class WebSocketService {
    private socket;

    private stompClient; //= Stomp.over(this.socket);
    //constructor( private wsConnection : $WebSocket ) {
    constructor() {
        this.socket = new SockJS("http://" + domain + chatConnectUrl);
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect("guest", "guest", this.connectCallback, this.errorCallback, domain);
        alert("Starting connection");

    //    this.wsConnection.onClose(this.onCloseHandler);
    //    this.wsConnection.onError(this.onErrorHandler);
    //    this.wsConnection.onOpen(this.onOpenHandler);
    //    this.wsConnection.onMessage(this.onRecieveHandler, {});
    }

    connectCallback () {
      this.stompClient.subscribe("/topic/message", this.displayMessage);
    }
    errorCallback (error) {
        alert("there was an error "+ error);
    }
    displayMessage(wsResponse) {
        var response = JSON.parse(wsResponse.body);
        //$("#messageStart").append(this.messageTemplate(response));
    }

    getData(){
        return "Hello";
    }
    send() {
        let chatMessage: ChatMessage = {
            "author": "fromMobile",
            "message": "a message from the telephone"
        }
        this.sendMessage(JSON.stringify(chatMessage));
        alert("message sent");
    }

    public connect() {
    //    this.wsConnection.connect(true);
    }

    public disconnect() {
    //    this.wsConnection.close(false);
    }

    private reconnect() {
    //    this.wsConnection.reconnect();
    }

    public sendMessage(msg: any) {
    //    this.wsConnection.send(msg);
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
