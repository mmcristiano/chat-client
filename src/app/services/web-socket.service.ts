import { ChatComponent } from './../chat/chat.component';
import { mensagemRecebidaDto } from './../models/mensagemRecebidaDto';
import { Injectable } from '@angular/core';
import { Command } from '../models/command';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  webSocket: WebSocket;
  chatMessages: string[] = [];

  logado: boolean = false;
  usuario: string;

  logadoChange: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  public openWebSocket() {
    this.webSocket = new WebSocket('ws://localhost:58541/ws');

    this.webSocket.onopen = (event) => {
      this.chatMessages.push('Bem-vindo ao TakeChat!');
      //this.chatMessages.push('Digite um nome e clique em Entrar para se conectar à sala #geral, divirta-se! ');
      console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event) => {

      const mensagem = this.parseMensagem(event.data);
      let comando = Command[mensagem.comando];

      switch (comando) {
        case (Command.Login):
        case (Command.Mensagem):
        case (Command.MensagemPrivada):
        case (Command.EntrouNaSala):
          if (mensagem.mensagem.includes(this.usuario)
            && mensagem.mensagem.includes("entrou na sala")) {
            this.logado = true;
            this.logadoChange.next(true);

          }
        case (Command.SaiuDaSala):
        case (Command.RecebeMensagem):
        case (Command.RecebeMensagemPrivada):
        case (Command.ErroMensao):
          this.chatMessages.push(mensagem.mensagem);
          break;
        case (Command.ErroLogin):
          alert(mensagem.mensagem);
          break;
        default:
          this.chatMessages.push('Algum erro inesperado aconteceu.');
          break;
      }
    };

    this.webSocket.onclose = (event) => {
      this.chatMessages.push('Você saiu da sala #geral.');
      this.chatMessages.push('Recarregue a página para iniciar uma nova conexão.');
      this.logado = false;
      this.logadoChange.next(false);

      console.log('Close: ', event);
    };
  }

  public login(command: string, user: string) {
    this.usuario = user;
    this.webSocket.send(command + " " + user);
  }

  public sendMessage(mensagem: string) {
    this.webSocket.send(mensagem);
  }

  public closeWebSocket() {
    this.webSocket.close();
  }

  public parseMensagem(mensagem: string) {
    if (mensagem == null)
      return null;

    let msg =
      new mensagemRecebidaDto(mensagem.substring(0, mensagem.indexOf(" ")),
        mensagem.substring(mensagem.indexOf(" ") + 1));

    return msg;
  }
}