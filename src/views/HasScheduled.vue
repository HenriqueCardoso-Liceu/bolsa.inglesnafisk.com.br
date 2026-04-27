<template>
  <AppLayout>
    <Card class="max-w-md w-full">

      <div class="spinner" v-if="isLoading"></div>

      <div v-if="!isLoading">
        <!-- Se o contato tiver um agendamento marcado, mas ainda não foi concluído -->
        <div v-if="hasSchedule && contact?.status_two.value !== 'attended'">
          <p class="text-2xl font-bold text-yellow-700 mb-4 text-center">
            {{ contact?.first_name }}, você já possui um horário agendado!
          </p>
    
          <div class="my-4 w-full flex flex-col items-center">
            <span class="text-gray-700 text-sm">Protocolo do agendamento:</span>
            <span class="text-2xl font-bold text-yellow-700 tracking-widest">{{ contact?.reference }}</span>
          </div>
    
          <div class="w-full bg-gray-50 rounded-xl p-4 mb-4 shadow">
            <p class="text-gray-700 mb-2"><strong>Nome:</strong> {{ contact?.name }}</p>
            <p class="text-gray-700 mb-2"><strong>Dia agendado:</strong> {{ contact?.date }}</p>
            <p class="text-gray-700 mb-2"><strong>Horário:</strong> {{ contact?.time }}</p>
            <p class="text-gray-700 mb-2"><strong>Unidade:</strong> {{ contact?.school }}</p>
            <p class="text-gray-700 mb-2"><strong>Endereço:</strong> {{ contact?.schoolAddress ?? 'Não informado' }}</p>
          </div>
    
          <p class="text-center text-gray-700 mb-6">
            Já encontramos um agendamento ativo para você. Se precisar alterar ou tiver dúvidas,
            <strong>entre em contato com nossa equipe</strong> pelo WhatsApp ou telefone.
          </p>
    
          <Button as="a" href="#" class="bg-green-600 hover:bg-green-700">
            Falar no WhatsApp
          </Button>
    
          <div class="w-full flex flex-col items-center mt-6">
            <Badge class="bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full mb-2 text-center">
              Leve RG, CPF e comprovante de residência no dia agendado. Menores de idade devem estar acompanhados pelo responsável legal.
            </Badge>
            <span class="text-gray-500 text-xs text-center">
              Nossa equipe está à disposição para ajudar em qualquer dúvida.
            </span>
          </div>
        </div>
  
        <!-- se o contato não tiver um agendamento mas foi selecionado para agendar -->
        <div v-if="!hasSchedule && contact?.status_two.value !== 'attended'">
          <p class="text-2xl font-bold text-red-700 mb-4 text-center">
            {{ contact?.firstName }} não encontramos seu agendamento!
          </p>
    
          <div class="my-4 w-full flex flex-col items-center gap-4">
            <span class="text-gray-700 text-sm text-center">Caso ainda não tenha agendado seu horário, verifique os horários disponíves na unidade mais próxima:</span>
            <Button as="a" class="bg-blue-600 hover:bg-blue-700 cursor-pointer" @click="goToSchedule">
              Agendar
            </Button>
          </div>
    
          <div class="w-full flex flex-col items-center mt-6">
            <span class="text-gray-500 text-xs text-center">
              Nossa equipe está à disposição para ajudar em qualquer dúvida.
            </span>
          </div>
        </div>
  
        <!-- Se o contato tiver um agendamento, mas o status for "attended", exibe a mensagem de atendimento concluído -->
        <div v-if="hasSchedule && contact?.status_two.value === 'attended'">
          <p class="text-2xl font-bold text-yellow-700 mb-4 text-center">
            {{ contact?.first_name }} já teve seu atendimento concluído!
          </p>
  
          <div class="my-4 w-full flex flex-col items-center">
            <span class="text-gray-700 text-sm">Protocolo do agendamento:</span>
            <span class="text-2xl font-bold text-yellow-700 tracking-widest">{{ contact?.reference }}</span>
          </div>
  
          <div class="w-full bg-gray-50 rounded-xl p-4 mb-4 shadow">
            <p class="text-gray-700 mb-2"><strong>Nome:</strong> {{ contact?.name }}</p>
            <p class="text-gray-700 mb-2"><strong>Atendimento:</strong> {{ contact?.date }}</p>
            <p class="text-gray-700 mb-2"><strong>Horário:</strong> {{ contact?.time }}</p>
            <p class="text-gray-700 mb-2"><strong>Unidade:</strong> {{ contact?.school }}</p>
            <p class="text-gray-700 mb-2"><strong>Endereço:</strong> {{ contact?.schoolAddress ?? 'Não informado' }}</p>
          </div>
  
          <div class="w-full flex flex-col items-center mt-6">
            <span class="text-gray-500 text-xs text-center">
              Nossa equipe está à disposição para ajudar em qualquer dúvida.
            </span>
          </div>
        </div>
      </div>

    </Card>
  </AppLayout>
</template>

<style scoped>
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  /* light gray */
  border-top: 4px solid #3b82f6;
  /* blue */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<script setup lang="ts">
import AppLayout from "@/layout/AppLayout.vue";
import Button from "@/components/ui/Button.vue";
import Badge from "@/components/ui/Badge.vue";
import Card from "@/components/ui/Card.vue";
import { useContactStore } from '@/stores/contactStore';
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { onMounted, ref } from 'vue';

const isLoading = ref(true);

const goToSchedule = () => {
  window.location.href = `/agendar/${route.params.id}`;
}

const route = useRoute();
const router = useRouter();

const contactStore = useContactStore(route.params.id);

const hasSchedule = ref(false);

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

onMounted(async () => {
  await getHasSchedule();

  switchData();
})
const contact = ref<Record<string, any> | null>(null);

async function getHasSchedule() {
  try {
    const response = await axios.get(`${API_URL}/api/contact/schedule/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    contact.value = response.data.contact;

    if (contact?.value?.reference) {
      hasSchedule.value = true;
    } 
     
  } catch (error) {
    console.log(error.response.data);
    
    if (error.response.data.contact.reference) {
      contact.value = error.response.data.contact;
      hasSchedule.value = true;
    }

    const code = Number(error?.response?.data?.code);
    const message = error?.response?.data?.error;

    if ([22, 20, 21].includes(code)) {
      router.push({ name: 'ScheduleUnavailable', query: { message } });
    } else {
      router.push({ name: '404' });
    }
    
  } finally {
    isLoading.value = false;
  }
}

function switchData() {
  if (contact.value?.school === 'Liceu - Suzano') {
    contact.value.school = 'FISK SUZANO';
    contact.value.schoolAddress = 'R. Tiradentes, 235 - Centro, Suzano - SP, 08674-195';
  }
}

</script>
