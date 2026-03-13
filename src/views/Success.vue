<template>
  <AppLayout>
    <Card class="max-w-md w-full">
      <p class="text-2xl font-bold text-blue-900 mb-3 text-center">
        {{ contactStore.contact?.name }}, o seu cadastro foi realizado com sucesso!
      </p>

      <div class="my-3 w-full flex flex-col items-center">
        <span class="text-gray-700 text-sm">Protocolo:</span>
        <span class="text-2xl font-bold text-blue-900 tracking-widest">{{ contactStore.contact?.protocol }}</span>
      </div>

      <hr class="my-4 border-blue-200 w-full" />

      <p class="text-gray-700 text-center mb-4">
        Entre no grupo exclusivo agora para garantir sua inscrição e receber todas as informações dos
        próximos passos!
      </p>

      <a href="https://wa.me/5511937576212?text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20processo%20de%20bolsas%20gratuito%20da%20Fisk" target="_blank" class="w-full text-center text-white font-bold py-3 rounded-lg transition mt-2 text-lg shadow disabled:opacity-50 bg-green-600 hover:bg-green-700">
        Entrar no Grupo do WhatsApp
      </a>

      <div class="w-full flex flex-col items-center mt-4">
        <Badge class="bg-red-100 text-red-800 text-xs font-semibold px-4 py-1 rounded-lg mb-2 text-center">
          Entre nos grupos para receber os próximos passos e concluir sua inscrição!
        </Badge>
        <span class="text-gray-500 text-xs text-center">
          Seus dados estão protegidos. <br /> Em caso de dúvida, nossa equipe está pronta para ajudar.
        </span>
      </div>
    </Card>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContactStore } from '@/stores/contactStore';
import AppLayout from "@/layout/AppLayout.vue";
import Badge from "@/components/ui/Badge.vue";
import Card from "@/components/ui/Card.vue";

const router = useRouter();
const route = useRoute();

const contactStore = useContactStore(route.params.id);

console.log(contactStore.contact)

onMounted(() => {
  if (!contactStore.contact) {
    console.warn("Nenhum contato encontrado no store, redirecionando para /404...");
    router.push("/404");
  }
});
</script>
