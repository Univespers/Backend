export class Datapoints {

    processes = null;

    constructor(processes) {
        this.processes = processes;
    }

    async loginUsuario(emailHash, senhaHash) {
        try {
            const [token] = await this.processes.callProcedure(`LOGIN("${emailHash}", "${senhaHash}")`);
            return token;
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