import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2, BookOpen, Clock } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { API_URL } from '../config';

const CreatePlan = () => {
    const [theme, setTheme] = useState('');
    const [duration, setDuration] = useState('1 semana');
    const [customDays, setCustomDays] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const durationValue = duration === 'Outro (dias)' ? `${customDays} dias` : duration;

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`${API_URL}/api/generate-plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    theme,
                    duration: durationValue
                }),
            });

            const data = await response.json();

            if (response.ok) {
                addToast('Plano gerado com sucesso!', 'success');
                navigate(`/plan/${data.plan.id}`);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error generating plan:', error);
            addToast('Erro ao gerar plano. Tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-plan-page animate-fade-in" style={{ background: 'var(--surface)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'white' }}>
                <div className="container">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center text-muted hover-text-primary">
                        <ArrowLeft size={20} style={{ marginRight: '8px' }} />
                        Voltar
                    </button>
                </div>
            </header>

            <main className="container flex-grow flex items-center justify-center p-md">
                <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
                    <div className="text-center" style={{ marginBottom: '2.5rem' }}>
                        <div style={{ background: '#f5f3ff', color: 'var(--primary)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <Sparkles size={30} />
                        </div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Novo Plano de Estudos</h1>
                        <p className="text-muted">Diga o que você quer aprender e nossa IA cria o roteiro perfeito.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
                        <div className="form-group">
                            <label style={{ fontSize: '1.1rem' }}>O que você quer estudar?</label>
                            <div style={{ position: 'relative' }}>
                                <BookOpen size={20} style={{ position: 'absolute', left: '12px', top: '16px', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                    className="input"
                                    placeholder="Ex: Python para Data Science, Marketing Digital..."
                                    style={{ padding: '1rem 1rem 1rem 3rem' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ fontSize: '1.1rem' }}>Quanto tempo você tem?</label>
                            <div style={{ position: 'relative' }}>
                                <Clock size={20} style={{ position: 'absolute', left: '12px', top: '16px', color: 'var(--text-muted)' }} />
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="input"
                                    style={{ padding: '1rem 1rem 1rem 3rem' }}
                                >
                                    <option>1 semana</option>
                                    <option>2 semanas</option>
                                    <option>1 mês</option>
                                    <option>2 meses</option>
                                    <option>3 meses</option>
                                    <option>Outro (dias)</option>
                                </select>
                            </div>
                        </div>

                        {duration === 'Outro (dias)' && (
                            <div className="form-group animate-fade-in">
                                <label>Número de dias</label>
                                <input
                                    type="number"
                                    value={customDays}
                                    onChange={(e) => setCustomDays(e.target.value)}
                                    className="input"
                                    placeholder="Ex: 45"
                                    min="1"
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-sm">
                                    <Loader2 className="animate-spin" size={20} />
                                    Criando sua mágica...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-sm">
                                    <Sparkles size={20} />
                                    Gerar Plano com IA
                                </div>
                            )}
                        </button>
                    </form>

                    {loading && (
                        <div className="text-center text-muted" style={{ marginTop: '1.5rem' }}>
                            <p className="animate-pulse">Isso pode levar alguns segundos...</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CreatePlan;
