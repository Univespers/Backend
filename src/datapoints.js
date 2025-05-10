export class Datapoints {

    processes = null;

    constructor(processes) {
        this.processes = processes;
    }

    async loginUsuario(emailHash, senhaHash) {
        try {
            const token = await this.processes.callProcedure(`Login("${emailHash}", "${senhaHash}")`);
            return token[0];
        } catch(error) {
            console.error(`Login: ${error.message}`);
        }
    }

    async logoutUsuario(token) {
        try {
            const mensagem = await this.processes.callProcedure(`Logout("${token}")`);
            return mensagem[0];
        } catch(error) {
            console.error(`Logout: ${error.message}`);
        }
    }

    async cadastrarUsuario(emailHash, senhaHash) {
        try {
            const autorizacoes = await this.processes.callProcedure(`GetAutorizacoes()`);
            const tipo = autorizacoes[0].tipo; // ESTUDANTE é o único = Index 0
            const token = await this.processes.callProcedure(`NovoUsuario("${emailHash}", "${senhaHash}", "${tipo}")`);
            return token[0];
        } catch(error) {
            console.error(`NovoUsuário: ${error.message}`);
        }
    }

    async criarEstudante(token, nome, emailInstitucional, polo, curso) {
        try {
            const mensagem = await this.processes.callProcedure(`NovoEstudante("${token}", "${nome}", "${emailInstitucional}", "${polo}", "${curso}")`);
            return mensagem[0];
        } catch(error) {
            console.error(`NovoEstudante: ${error.message}`);
        }
    }

    async pesquisarColegas(termo, pagina, quantidade) {
        try {
            const mensagem = await this.processes.callProcedure(`PesquisarColegas("${termo}", ${pagina * quantidade}, ${quantidade})`);
            return mensagem; // Lista
        } catch (error) {
            console.error(`PesquisarColegas: ${error.message}`);
        }
    }

    async getColega(uuid) {
        try {
            const mensagem = await this.processes.callProcedure(`GetColega("${uuid}")`);
            return mensagem[0];
        } catch (error) {
            console.error(`GetColega: ${error.mensagem}`);
        }
    }

    async getColegaDetalhes(uuid) {
        try {
            const mensagem = await this.processes.callProcedure(`GetColegaDetalhes("${uuid}")`);
            return mensagem[0];
        } catch (error) {
            console.error(`GetColegaDetalhes: ${error.mensagem}`);
        }
    }

    async getColegaContatos(uuid) {
        try {
            const mensagem = await this.processes.callProcedure(`GetColegaContatos("${uuid}")`);
            return mensagem; // Lista
        } catch (error) {
            console.error(`GetColegaContatos: ${error.mensagem}`);
        }
    }

}