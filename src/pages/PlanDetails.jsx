import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Trash2, CheckCircle, Book } from 'lucide-react';

const PlanDetails = () => {
    const { id } = useParams();
    const [plan, setPlan] = useState(null);
    const [parsedContent, setParsedContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`http://localhost:3000/api/plans/${id}?userId=${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPlan(data.plan);

                    try {
                        // Try to parse JSON content
                        const content = JSON.parse(data.plan.content);
                        setParsedContent(content);
                    } catch (e) {
                        // Fallback for old text-based plans
                        setParsedContent({ description: data.plan.content, modules: [] });
                    }
                } else {
                    console.error('Plan not found');
                }
            } catch (error) {
                console.error('Error fetching plan:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.')) return;

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`http://localhost:3000/api/plans/${id}?userId=${user.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                navigate('/dashboard');
            } else {
                alert('Erro ao excluir plano.');
            }
        } catch (error) {
            console.error('Error deleting plan:', error);
        }
    };

    if (loading) return <div className="container" style={{ padding: '40px' }}>Carregando...</div>;
    if (!plan) return <div className="container" style={{ padding: '40px' }}>Plano não encontrado.</div>;

    return (
        <div className="plan-details-page" style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: '40px' }}>

            {/* Header / Nav */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 0', marginBottom: '2rem' }}>
                <div className="container flex justify-between items-center">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center text-muted" style={{ fontWeight: '500' }}>
                        <ArrowLeft size={20} style={{ marginRight: '8px' }} />
                        Voltar para o Dashboard
                    </button>

                    <button onClick={handleDelete} style={{ color: '#ef4444', display: 'flex', items: 'center', gap: '8px', fontWeight: '600' }}>
                        <Trash2 size={20} /> Excluir Plano
                    </button>
                </div>
            </header>

            <main className="container">
                {/* Title Section */}
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>{plan.theme}</h1>
                    <div className="flex gap-lg text-muted" style={{ fontSize: '1.125rem' }}>
                        <div className="flex items-center">
                            <Clock size={24} style={{ marginRight: '8px' }} />
                            Duração: <strong>{plan.duration}</strong>
                        </div>
                        <div className="flex items-center">
                            <Calendar size={24} style={{ marginRight: '8px' }} />
                            Criado em: {new Date(plan.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Description */}
                    {parsedContent?.description && (
                        <div className="card" style={{ background: '#eff6ff', border: 'none' }}>
                            <p style={{ fontSize: '1.25rem', color: '#1e40af' }}>{parsedContent.description}</p>
                        </div>
                    )}

                    {/* Modules */}
                    {parsedContent?.modules && parsedContent.modules.length > 0 ? (
                        parsedContent.modules.map((module, index) => (
                            <div key={index} className="card">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ background: 'var(--primary)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {index + 1}
                                    </div>
                                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{module.title}</h2>
                                </div>

                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {module.topics.map((topic, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem', fontSize: '1.125rem' }}>
                                            <CheckCircle size={20} style={{ marginTop: '4px', color: 'var(--success)', flexShrink: 0 }} />
                                            <span>{topic}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        // Fallback for plain text content
                        <div className="card">
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{plan.content}</pre>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default PlanDetails;
