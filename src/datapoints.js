export class Datapoints {

    processes = null;

    constructor(processes) {
        this.processes = processes;
    }

    async loginUsuario(emailHash, senhaHash) {
        try {
            const [token] = await this.processes.callProcedure(`Login("${emailHash}", "${senhaHash}")`);
            return token;
        } catch(error) {
            console.error("Erro no login: ", error);
        }
    }

    async cadastrarUsuario(emailHash, senhaHash) {
        try {
            const autorizacoes = await this.processes.callProcedure(`GetAutorizacoes()`);
            const tipo = autorizacoes[0].tipo; // ESTUDANTE é o único = Index 0
            const [token] = await this.processes.callProcedure(`NovoUsuario("${emailHash}", "${senhaHash}", "${tipo}")`);
            return token;
        } catch(error) {
            console.error("Erro no cadastro: ", error);
        }
    }

}