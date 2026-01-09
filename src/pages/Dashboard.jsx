import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Clock, Calendar, BookOpen, LogOut } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchPlans(parsedUser.id);
        }
    }, [navigate]);

    const fetchPlans = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/plans?userId=${userId}`);
            if (response.ok) {
                const data = await response.json();
                setPlans(data.plans);
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
            addToast('Erro ao carregar planos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const deletePlan = async (id, e) => {
        e.stopPropagation(); // Prevent card click
        if (!window.confirm('Tem certeza que deseja excluir este plano?')) return;

        try {
            const response = await fetch(`http://localhost:3000/api/plans/${id}?userId=${user.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setPlans(plans.filter(plan => plan.id !== id));
                addToast('Plano excluído com sucesso', 'success');
            } else {
                addToast('Erro ao excluir plano', 'error');
            }
        } catch (error) {
            console.error('Error deleting plan:', error);
            addToast('Erro ao excluir plano', 'error');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
        addToast('Você saiu com sucesso', 'info');
    };

    if (!user) return null;

    return (
        <div className="dashboard-page animate-fade-in" style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: '40px' }}>
            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 10 }}>
                <div className="container flex justify-between items-center nav-header">
                    <div className="flex items-center gap-sm">
                        <div style={{ background: 'var(--primary)', color: 'white', padding: '6px', borderRadius: '8px' }}>
                            <BookOpen size={24} />
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)' }}>StudyFlow</div>
                    </div>

                    <div className="flex items-center gap-md">
                        <span className="text-muted hidden-mobile">Olá, <strong>{user.name}</strong></span>
                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary flex items-center gap-sm"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                            <LogOut size={16} />
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '40px 0' }}>
                {/* Welcome & Action */}
                <div className="flex justify-between items-center wrap-mobile" style={{ marginBottom: '3rem', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: 'var(--h1)', marginBottom: '0.5rem', lineHeight: '1.2' }}>Meus Planos</h1>
                        <p className="text-muted">Gerencie seus cronogramas de aprendizado.</p>
                    </div>
                    <button className="btn btn-primary shadow-hover" onClick={() => navigate('/create-plan')}>
                        <Plus size={20} style={{ marginRight: '8px' }} />
                        Novo Plano
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-xl">
                        <div className="spinner" style={{ borderTopColor: 'var(--primary)' }}></div>
                    </div>
                ) : plans.length === 0 ? (
                    <div className="empty-state text-center animate-slide-up" style={{ padding: '4rem 2rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                        <div style={{ background: '#fef2f2', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                            <BookOpen size={40} />
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Você ainda não tem nenhum plano</h3>
                        <p className="text-muted" style={{ marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                            Que tal criar o seu primeiro cronograma personalizado agora? É rápido e feito por IA.
                        </p>
                        <button className="btn btn-primary" onClick={() => navigate('/create-plan')}>
                            Começar agora
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-lg">
                        {plans.map((plan, index) => (
                            <div
                                key={plan.id}
                                className="card card-hover animate-slide-up"
                                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animationDelay: `${index * 100}ms`, cursor: 'pointer' }}
                                onClick={() => navigate(`/plan/${plan.id}`)}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 style={{ fontSize: '1.25rem', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                        {plan.theme}
                                    </h3>
                                    <button
                                        onClick={(e) => deletePlan(plan.id, e)}
                                        style={{ color: 'var(--text-muted)', padding: '8px', margin: '-8px -8px 0 0', borderRadius: '50%' }}
                                        className="hover-bg-danger"
                                        title="Excluir"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-md text-muted" style={{ fontSize: '0.875rem', marginTop: 'auto' }}>
                                    <div className="flex items-center">
                                        <Clock size={16} style={{ marginRight: '4px' }} />
                                        {plan.duration}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar size={16} style={{ marginRight: '4px' }} />
                                        {new Date(plan.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        Ver detalhes →
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
