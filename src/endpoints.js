import express from 'express';
import cors from 'cors';

const PORT = 3000;
const apiEndpoint = "api";
const infoEndpoint = `/${apiEndpoint}/info`;
const polosEndpoint = `/${apiEndpoint}/polos`;
const usuarioEndpoint = `/${apiEndpoint}/usuario`;
const estudanteEndpoint = `/${apiEndpoint}/estudante`;
// const grupoEndpoint = `/${apiEndpoint}/grupo`;
// const chatEndpoint = `/${apiEndpoint}/chat`;

export class Endpoints {

    app = express();

    constructor(processes, datapoints) {
        this.app.use(cors()); // Allow different domains
        this.app.use(express.json()); // Allow JSON parsing

        this.load(processes, datapoints);
    }

    load(processes, datapoints) {

        // 🔐 Rota: Login
        this.app.post(`${usuarioEndpoint}/login`, async (requisito, resposta) => {
            try {
                const email = requisito.body.email;
                const senha = requisito.body.password;
                const token = await datapoints.loginUsuario(email, senha);
                if(token) {
                    resposta.json(token);
                } else {
                    resposta.status(500).json({
                        error: {
                            message: "NOT_FOUND"
                        }
                    });
                }
            } catch(error) {
                resposta.status(500).json({
                    error: {
                        message: "ERROR",
                        details: error.message
                    }
                });
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
