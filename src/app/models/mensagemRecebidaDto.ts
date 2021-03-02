export class mensagemRecebidaDto {
    comando: string;
    mensagem: string;

    constructor(comando: string, mensagem: string) {
        this.comando = comando;
        this.mensagem = mensagem;
    }
}