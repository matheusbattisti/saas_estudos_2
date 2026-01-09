import 'dotenv/config'; // Load env vars
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import db from './db.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Helper function to convert duration string to days
function convertDurationToDays(durationStr) {
    if (!durationStr) return 7; // default

    const lower = durationStr.toLowerCase();

    // Handle custom days "X dias"
    if (lower.includes('dias') || lower.includes('dia')) {
        const numbers = lower.replace(/\D/g, '');
        return parseInt(numbers) || 7;
    }

    // Handle weeks
    if (lower.includes('semana')) {
        const numbers = lower.replace(/\D/g, '');
        const num = parseInt(numbers) || 1;
        return num * 7;
    }

    // Handle months
    if (lower.includes('mês') || lower.includes('mes')) {
        const numbers = lower.replace(/\D/g, '');
        const num = parseInt(numbers) || 1;
        return num * 30;
    }

    return 30; // default fallback
}

// Register Endpoint
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

        db.run(sql, [name, email, hashedPassword], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Email já cadastrado' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.json({
                message: 'Usuário criado com sucesso',
                user: { id: this.lastID, name, email }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Erro no servidor' });
        }
        if (!user) {
            return res.status(400).json({ error: 'Email ou senha inválidos' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Email ou senha inválidos' });
        }

        res.json({
            message: 'Login realizado com sucesso',
            user: { id: user.id, name: user.name, email: user.email }
        });
    });
});

// Get All Plans Endpoint
app.get('/api/plans', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const sql = 'SELECT * FROM plans WHERE user_id = ? ORDER BY created_at DESC';
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar planos' });
        }
        res.json({ plans: rows });
    });
});

// Get Single Plan Endpoint
app.get('/api/plans/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const sql = 'SELECT * FROM plans WHERE id = ? AND user_id = ?';
    db.get(sql, [id, userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar plano' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Plano não encontrado ou acesso negado' });
        }
        res.json({ plan: row });
    });
});

// Delete Plan Endpoint
app.delete('/api/plans/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const sql = 'DELETE FROM plans WHERE id = ? AND user_id = ?';
    db.run(sql, [id, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Erro ao excluir plano' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Plano não encontrado ou acesso negado' });
        }
        res.json({ message: 'Plano excluído com sucesso' });
    });
});

// Generate Plan Endpoint (Real N8N Integration)
app.post('/api/generate-plan', async (req, res) => {
    const { userId, theme, duration } = req.body;

    if (!userId || !theme || !duration) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const days = convertDurationToDays(duration);
    const n8nUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nUrl || n8nUrl.includes('replace-me')) {
        console.warn('N8N URL not configured, using Mock');
        // Fallback to mock for testing if no URL
        setTimeout(() => {
            const mockData = {
                description: `Plano (Mock) para ${theme} em ${days} dias. Configure o .env para usar IA real.`,
                modules: [
                    {
                        title: "Módulo Mock 1",
                        topics: ["Configure", "O", "Webhook"]
                    }
                ]
            };
            const mockContent = JSON.stringify(mockData);
            const sql = 'INSERT INTO plans (user_id, theme, duration, content) VALUES (?, ?, ?, ?)';
            db.run(sql, [userId, theme, duration, mockContent], function (err) {
                if (err) return res.status(500).json({ error: 'Erro ao salvar plano' });
                res.json({
                    message: 'Plano gerado com sucesso',
                    plan: { id: this.lastID, user_id: userId, theme, duration, content: mockContent }
                });
            });
        }, 2000);
        return;
    }

    try {
        const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject: theme, time: days })
        });

        if (!response.ok) {
            throw new Error(`N8N Error: ${response.statusText}`);
        }

        const n8nData = await response.json();
        console.log('N8N Response:', JSON.stringify(n8nData, null, 2));

        let subjects = [];

        // Check possible structures based on N8N output
        if (Array.isArray(n8nData) && n8nData.length > 0) {
            if (n8nData[0].output && n8nData[0].output.subjects) {
                subjects = n8nData[0].output.subjects;
            } else if (n8nData[0].subjects) {
                subjects = n8nData[0].subjects;
            }
        } else if (n8nData.subjects) {
            subjects = n8nData.subjects;
        } else if (n8nData.output && n8nData.output.subjects) {
            subjects = n8nData.output.subjects;
        }

        const modules = subjects.map(item => ({
            title: `${item.interval ? item.interval + ': ' : ''}${item.topic}`,
            topics: [
                item.description,
                `Dica: ${item.tip}`
            ]
        }));

        const planData = {
            description: `Plano de estudos personalizado para ${days} dias sobre ${theme}.`,
            modules: modules
        };

        const contentJson = JSON.stringify(planData);

        const sql = 'INSERT INTO plans (user_id, theme, duration, content) VALUES (?, ?, ?, ?)';
        db.run(sql, [userId, theme, duration, contentJson], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Erro ao salvar plano no banco' });
            }
            res.json({
                message: 'Plano gerado com sucesso',
                plan: { id: this.lastID, user_id: userId, theme, duration, content: contentJson }
            });
        });

    } catch (error) {
        console.error('Error calling n8n:', error);
        res.status(500).json({ error: 'Erro ao gerar plano com IA' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
