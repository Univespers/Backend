export class Datapoints {

    processes = null;

    constructor(processes) {
        this.processes = processes;
    }

    async loginUsuario(emailHash, senhaHash) {
        try {
            this.processes.callProcedure(`LOGIN(${emailHash}, ${senhaHash})`);
        } catch(error) {
            console.error("Erro no login: ", error);
        }
    }

    async cadastrarUsuario(emailHash, senhaHash) {
        try {
            return this.processes.callProcedure(`GetAutorizacoes()`);
        } catch(error) {
            console.error("Erro no cadastro: ", error);
        }
    }

}