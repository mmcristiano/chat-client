import { Command } from './../models/command';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WebSocketService } from '../services/web-socket.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';


@Component({
  selector: 'cf-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  _logadoSubscription: any;

  @Input()
  privada: string = 'false';

  @Input()
  usuario: string = '';

  @Input()
  public logado: boolean;

  constructor(public webSocketService: WebSocketService) {
    this.logado = webSocketService.logado;
    this._logadoSubscription = webSocketService.logadoChange.subscribe((value) => {
      this.logado = value
    })
  }

  ngOnInit(): void {
    this.webSocketService.openWebSocket();
  }

  ngOnDestroy(): void {
    this.webSocketService.closeWebSocket();
  }

  sendMessage(sendForm: NgForm) {
    let command;
    let mensagem = sendForm.value.message;
    let destinatario = sendForm.value.destinatario;

    if (mensagem != null && mensagem.trim().length > 0) {
      if (destinatario == null || destinatario.trim().length == 0) {

        command = Command['Mensagem'];
        this.webSocketService.sendMessage(command + " " + mensagem);
      }
      else if (destinatario != null && destinatario.trim().length != 0 && this.privada == 'false') {

        command = Command['Mensagem'];
        this.webSocketService.sendMessage(command + " @" + destinatario + " " + mensagem);
      } else if (destinatario != null && destinatario.trim().length != 0 && this.privada == 'true') {

        command = Command['MensagemPrivada'];
        this.webSocketService.sendMessage(command + " @" + destinatario + " " + mensagem);
      }
    } else {
      alert('Digite uma mensagem.');
    }


    sendForm.controls.message.reset();
  }
  login(loginForm: NgForm) {
    const user = loginForm.value.user;
    const command = Command['Login'].toString();

    if (user == null || user.trim().length == 0) {
      alert('Preencha um nome válido.');
    } else {
      if (this.logado) {
        this.webSocketService.closeWebSocket();
      } else {
        this.webSocketService.login(command, user);
      }
    }




  }
}