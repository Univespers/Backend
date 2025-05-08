import express from 'express';
import cors from 'cors';

import { CurrentStatus } from './status.js';

const PORT = 3000;
const apiEndpoint = "api";
const infoEndpoint = `/${apiEndpoint}/info`;
const polosEndpoint = `/${apiEndpoint}/polos`;
const usuarioEndpoint = `/${apiEndpoint}/usuario`;
const estudanteEndpoint = `/${apiEndpoint}/estudante`;
// const grupoEndpoint = `/${apiEndpoint}/grupo`;
// const chatEndpoint = `/${apiEndpoint}/chat`;
const HEADER_TOKEN = "X-Authentication-Token";

export class Endpoints {

    app = express();

    constructor(processes, datapoints) {
        this.app.use(cors()); // Allow different domains
        this.app.use(express.json()); // Allow JSON parsing
        // Carrega endpoints
        this.load(processes, datapoints);
    }

    load(processes, datapoints) {

        // ℹ️ Rota: Info
        this.app.get(``, getInfo);
        this.app.get(`${apiEndpoint}`, getInfo);
        this.app.get(`${infoEndpoint}`, getInfo);
        async function getInfo(requisito, resposta) {
            try {
                // Resposta
                console.log(`Info: ok`);
                resposta.json({
                    versão: `${CurrentStatus.CURRENT_VERSION}`,
                    nome: `${CurrentStatus.PROJECT_NAME}`,
                    grupo: `${CurrentStatus.GROUP_NAME}`
                });
            } catch(error) {
                console.error(`Info: ${error.message}`);
                resposta.status(500).json({ error: { message: "ERROR", details: error.message } });
            }
        }

        // 🔐 Rota: Login
        this.app.post(`${usuarioEndpoint}/login`, async (requisito, resposta) => {
            try {
                // Body
                const email = processes.getHash(requisito.body.email);
                const senha = processes.getHash(requisito.body.password);
                // Database request
                const token = await datapoints.loginUsuario(email, senha);
                // Resposta
                if(token && !token.response) {
                    console.log(`Login: ok`);
                    resposta.json({
                        token: `${token.uuid}`,
                        tipo: `${token.tipo}`,
                        validade: token.validade
                    });
                } else {
                    console.error(`Login: ${message.response}`);
                    switch(token.response) {
                        case "not_found": default:
                            resposta.status(500).json({ error: { message: "NOT_FOUND" } });
                            break;
                    }
                }
            } catch(error) {
                console.error(`Login: ${error.message}`);
                resposta.status(500).json({ error: { message: "ERROR", details: error.message } });
            }
        });

        // 🔐 Rota: Cadastro de Usuário
        this.app.post(`${usuarioEndpoint}/novo`, async (requisito, resposta) => {
            try {
                // Body
                const email = processes.getHash(requisito.body.email);
                const senha = processes.getHash(requisito.body.password);
                // Database request
                const message = await datapoints.cadastrarUsuario(email, senha);
                // Resposta
                if(message.response === "ok") {
                    console.log(`NovoUsuário: ${message.response}`);
                    resposta.json({
                        response: "OK"
                    });
                } else {
                    console.error(`NovoUsuário: ${message.response}`);
                    switch(message.response) {
                        case "not_found":
                            resposta.status(500).json({ error: { message: "TOKEN_NOT_FOUND" } });
                            break;
                        case "already_exists":
                            resposta.status(500).json({ error: { message: "ALREADY_EXISTS" } });
                            break;
                        case "expired":
                            resposta.status(500).json({ error: { message: "TOKEN_EXPIRED" } });
                            break;
                        default:
                            resposta.status(500).json({ error: { message: "ERROR" } });
                            break;
                    }
                }
            } catch(error) {
                console.error(`NovoUsuário: ${error.message}`);
                resposta.status(500).json({ error: { message: "ERROR", details: error.message } });
            }
        });

        // 📑 Rota: Cadastro de Estudante
        this.app.post(`${estudanteEndpoint}/novo`, async (requisito, resposta) => {
            try {
                // Header
                const token = requisito.get(HEADER_TOKEN);
                // Body
                const nome = requisito.body.nome;
                const emailInstitucional = requisito.body.emailInstitucional;
                const polo = requisito.body.polo;
                const curso = requisito.body.curso;
                // Database request
                const message = await datapoints.criarEstudante(token, nome, emailInstitucional, polo, curso);
                // Resposta
                if(message.response === "ok") {
                    console.log(`NovoEstudante: ${message.response}`);
                    resposta.json({
                        response: "OK"
                    });
                } else {
                    console.error(`NovoEstudante: ${message.response}`);
                    switch(message.response) {
                        case "not_found":
                            resposta.status(500).json({ error: { message: "TOKEN_NOT_FOUND" } });
                            break;
                        case "already_exists":
                            resposta.status(500).json({ error: { message: "ALREADY_EXISTS" } });
                            break;
                        case "expired":
                            resposta.status(500).json({ error: { message: "TOKEN_EXPIRED" } });
                            break;
                        default:
                            resposta.status(500).json({ error: { message: "ERROR" } });
                            break;
                    }
                }
            } catch(error) {
                console.error(`NovoEstudante: ${error.message}`);
                resposta.status(500).json({ error: { message: "ERROR", details: error.message } });
            }
        });

        // 📑 Rota: Pesquisar Colegas
        this.app.get(`${estudanteEndpoint}/colegas`, async (requisito, resposta) => {
            try {
                // Params
                const termo = requisito.query.termo;
                const pagina = parseInt(requisito.query.pagina);
                const quantidade = parseInt(requisito.query.quantidade);
                // Consulta ao banco
                const message = await datapoints.pesquisarColegas(termo, pagina - 1, quantidade);
                // Resposta
                console.log(`PesquisarColegas: LISTA`);
                console.log(termo);
                resposta.json({
                    lista: message,
                    pagina: pagina,
                    totalPaginas: message[0]?.total ?? 0
                });
            } catch (error) {
                console.error(`PesquisarColegas: ${error.message}`);
                resposta.status(500).json({ error: { message: "ERROR", details: error.message } });
            }
        });

    }

    start() {
        this.app.listen(PORT, () => {
            console.log(`Escutando na porta ${PORT}`);
        });
    }

}
