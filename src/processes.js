import mysql from 'mysql2/promise';
import crypto from 'crypto';

const dbConnection = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'univespers'
};

export class Processes {

    constructor() {
        this.connectBD();
    }

    // Banco de dados
    bdConnection = null;
    async connectBD() {
        try {
            this.bdConnection = await mysql.createConnection(dbConnection);
        } catch (error) {
            console.error("Erro de conexão: ", error);
        }
        return null;
    }
    async unconnectBD() {
        if(this.bdConnection) await this.bdConnection.end();
    }
    async callProcedure(procedureCall) {
        try {
            const [query] = await this.bdConnection.execute(`CALL ${procedureCall}`);
            return query[0];
        } catch(error) {
            console.error("Erro na query: ", error);
        }
    }

    // Gerador de hash
    getHash(texto) {
        const hash = crypto.createHash('sha256');
        hash.update(texto);
        return hash.digest('hex');
    }

}
