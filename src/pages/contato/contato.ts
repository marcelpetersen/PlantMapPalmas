import { Component } from '@angular/core';
import {Http, Request, RequestMethod, Headers } from "@angular/http";
import 'rxjs/add/operator/map';

@Component({
  selector: 'contato-page',
  templateUrl: 'contato.html',
  providers: [Http]
})
export class ContatoPage {

  http: Http;
  mailgunUrl: string;
  mailgunApiKey: string;

  constructor(http: Http) {
    this.http = http;
    this.mailgunUrl = "https://api.mailgun.net/v3/sandbox9de5a0bd35434d3b94d0a48658184a40.mailgun.org/messages";
    this.mailgunApiKey = window.btoa("api:key-afa9cd15dd57ff4cb353571418cc8aef");
  }

  send(recipient: string, subject: string, message: string) {
    var requestHeaders = new Headers();
    requestHeaders.append("Authorization", "Basic " + this.mailgunApiKey);
    requestHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    this.http.request(new Request({
      method: RequestMethod.Post,
      url: "https://api.mailgun.net/v3/" + this.mailgunUrl + "/messages",
      body: "from=test@example.com&to=" + recipient + "&subject=" + subject + "&text=" + message,
      headers: requestHeaders
    }))
    .subscribe(success => {
      console.log("SUCCESS -> " + JSON.stringify(success));
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
}
