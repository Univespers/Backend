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

        // // ✅ Rota: Listar alunos (dados reais do banco)
        // this.app.get("/api/colleagues/list", async (requisito, resposta) => {
        //     try {
        //     const conn = await conectar();
        //     const [rows] = await conn.execute("SELECT * FROM Aluno");
        //     res.json({ lista: rows });
        //     await conn.end();
        //     } catch (err) {
        //     res.status(500).json({ error: "Erro ao buscar alunos", details: err.message });
        //     }
        // });
    
        // // ✅ Rota: Detalhes de um aluno
        // this.app.get("/api/colleagues/:id/details", async (req, res) => {
        //     const { id } = req.params;
        //     try {
        //     const conn = await conectar();
        //     const [rows] = await conn.execute("SELECT * FROM Aluno WHERE id = ?", [id]);
    
        //     if (rows.length === 0) return res.status(404).json({ error: "Aluno não encontrado" });
    
        //     const aluno = rows[0];
        //     res.json({
        //         id: aluno.id,
        //         nome: aluno.nome,
        //         curso: aluno.curso,
        //         polo: aluno.polo,
        //         emailInstitucional: aluno.email_institucional,
        //         descricao: aluno.descricao,
        //         contatos: {
        //             email: aluno.email_pessoal,
        //             linkedin: aluno.linkedin,
        //         },
        //     });
        //     await conn.end();
        //     } catch (err) {
        //     res.status(500).json({ error: "Erro ao buscar detalhes", details: err.message });
        //     }
        // });
    
        // // ✅ Rota: Cadastrar aluno
        // this.app.post("/api/colleagues", async (req, res) => {
        //     const {
        //         nome,
        //         curso,
        //         polo,
        //         emailInstitucional,
        //         descricao,
        //         emailPessoal,
        //         linkedin,
        //     } = req.body;
    
        //     try {
        //     const conn = await conectar();
        //     await conn.execute(
        //         `INSERT INTO Aluno (nome, curso, polo, email_institucional, descricao, email_pessoal, linkedin)
        //         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        //         [nome, curso, polo, emailInstitucional, descricao, emailPessoal, linkedin]
        //     );
        //     await conn.end();
        //     res.status(201).json({ message: "Aluno cadastrado com sucesso!" });
        //     } catch (err) {
        //     res.status(500).json({ error: "Erro ao cadastrar aluno", details: err.message });
        //     }
        // });
    }

    start() {
        this.app.listen(PORT, () => {
            console.log(`Escutando na porta ${PORT}`);
        });
    }

}
