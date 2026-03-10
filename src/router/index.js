import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Register.vue'),
        meta: {
            title: 'Fisk - Bolsa de Estudo 100% Grátis',
            description: 'Garanta um desconto de 50% na Fisk!. Inscreva-se agora e transforme seu futuro.',
        },
    },
    {
        path: '/completar/:id',
        name: 'Complete',
        component: () => import('@/views/Complete.vue'),
        props: true,
        meta: {
            title: 'Complete seu Cadastro - Fisk',
            description: 'Complete seu cadastro para finalizar a inscrição.',
        },
    },
    {
        path: '/agendar/:id',
        name: 'Agendar',
        props: true,
        component: () => import('@/views/Schedule.vue'),
        meta: {
            title: 'Agendamento - Fisk',
            description: 'Agende seu atendimento para garantir sua vaga.',
        },
    },
    {
        path: '/confirmacao/:id',
        name: 'Confirmacao',
        props: true,
        component: () => import('@/views/Confirmation.vue'),
        meta: {
            title: 'Confirmação de Agendamento - Fisk',
            description: 'Veja os detalhes do seu agendamento para concluir sua inscrição na Fisk.',
        },
    },
    {
        path: '/sucesso/:id',
        name: 'Sucesso',
        component: () => import('@/views/Success.vue'),
        props: true,
        meta: {
            title: 'Cadastro Realizado com Sucesso - Fisk',
            description: 'Seu cadastro foi realizado com sucesso!',
        },
    },
    {
        path: '/agendado/:id',
        name: 'Agendamento',
        component: () => import('@/views/HasScheduled.vue'),
        meta: {
            title: 'Confirmação de Agendamento - Fisk',
            description: 'Veja os detalhes do seu agendamento para concluir sua inscrição no Fisk.',
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
        meta: {
            title: 'Página não encontrada - Fisk',
            description: 'A página que você tentou acessar não existe. Volte para o início.',
        },
    },
    {
        path: '/whatsapp',
        name: 'ExternalRedirect',
        beforeEnter() {
            window.location.href = 'https://selflux.liceubrasil.com.br/qcvkg94?utm_souce=grupo_bolsas';
        },
    },
    {
        path: '/agenda/unavailable',
        name: 'ScheduleUnavailable',
        component: () => import('@/views/ScheduleUnavailable.vue'),
        props: route => ({ message: route.query.message }),
        meta: {
            title: 'Página não encontrada - Fisk',
            description: 'A página que você tentou acessar não existe. Volte para o início.',
        },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.afterEach((to) => {
    const defaultTitle = 'Fisk';
    const defaultDescription = 'Bolsa de estudos 100% gratuita na Fisk. Inscreva-se!';

    document.title = to.meta.title || defaultTitle;

    const description = to.meta.description || defaultDescription;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
        descriptionTag.setAttribute('content', description);
    } else {
        descriptionTag = document.createElement('meta');
        descriptionTag.setAttribute('name', 'description');
        descriptionTag.setAttribute('content', description);
        document.head.appendChild(descriptionTag);
    }
});

export default router;
