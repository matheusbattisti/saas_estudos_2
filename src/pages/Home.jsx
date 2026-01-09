import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Brain, CheckCircle } from 'lucide-react';
import heroImage from '../assets/hero-illustration.png';

const Home = () => {
    return (
        <div className="home-page">
            {/* Navigation placeholder */}
            <nav className="container flex justify-between items-center" style={{ padding: '20px 0' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary)' }}>StudyFlow</div>
                <div className="flex gap-md">
                    <Link to="/login" className="btn btn-secondary">Login</Link>
                    <Link to="/register" className="btn btn-primary">Começar Agora</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero container grid grid-cols-2 gap-lg items-center" style={{ padding: '80px 0' }}>
                <div className="hero-content">
                    <h1 style={{ marginBottom: '1.5rem' }}>
                        Aprenda qualquer coisa com um plano feito pra você
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
                        Diga o que você quer aprender e quanto tempo tem. Nossa IA cria um cronograma de estudos personalizado para você economizar tempo e aprender mais rápido.
                    </p>
                    <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.125rem' }}>
                        Criar meu plano grátis <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                    </Link>
                </div>
                <div className="hero-image">
                    <img
                        src={heroImage}
                        alt="AI Study Planning Illustration"
                        style={{ width: '100%', height: 'auto', borderRadius: '1rem', boxShadow: 'var(--shadow-lg)' }}
                    />
                </div>
            </section>

            {/* How it Works */}
            <section style={{ backgroundColor: 'white', padding: '80px 0' }}>
                <div className="container">
                    <h2 className="text-center" style={{ marginBottom: '3rem' }}>Como funciona</h2>
                    <div className="grid grid-cols-3 gap-lg">
                        <div className="step-card text-center">
                            <div style={{ background: 'var(--secondary)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                                <BookOpen size={32} />
                            </div>
                            <h3>1. Escolha o tema</h3>
                            <p className="text-muted">Digite qualquer assunto que você queira dominar, do básico ao avançado.</p>
                        </div>
                        <div className="step-card text-center">
                            <div style={{ background: 'var(--secondary)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                                <Clock size={32} />
                            </div>
                            <h3>2. Defina seu tempo</h3>
                            <p className="text-muted">Informe quantas horas por dia ou semana você pode se dedicar aos estudos.</p>
                        </div>
                        <div className="step-card text-center">
                            <div style={{ background: 'var(--secondary)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                                <CheckCircle size={32} />
                            </div>
                            <h3>3. Receba o plano</h3>
                            <p className="text-muted">Nossa IA gera um cronograma completo com tópicos e recursos para você seguir.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="container" style={{ padding: '80px 0' }}>
                <h2 className="text-center" style={{ marginBottom: '3rem' }}>Por que usar o StudyFlow?</h2>
                <div className="grid grid-cols-3 gap-lg">
                    <div className="card">
                        <h3 style={{ marginBottom: '0.5rem' }}>Personalizado</h3>
                        <p className="text-muted">Nada de planos genéricos. O conteúdo é adaptado ao seu nível e disponibilidade.</p>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: '0.5rem' }}>Economia de Tempo</h3>
                        <p className="text-muted">Pare de gastar horas procurando o que estudar. Vá direto ao ponto.</p>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: '0.5rem' }}>Organização Automática</h3>
                        <p className="text-muted">Saiba exatamente o que estudar a cada dia para alcançar seus objetivos.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: 'white', padding: '40px 0', borderTop: '1px solid var(--border)' }}>
                <div className="container text-center text-muted">
                    <p>&copy; 2026 StudyFlow. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
