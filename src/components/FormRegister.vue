<template>
  <form class="flex flex-col gap-3 w-full" @submit.prevent="handleSubmit">
    <Input 
      v-model="registerForm.name" 
      placeholder="Nome completo" 
      required aria-label="Nome completo"
      :error="errors.name" 
    />

    <Input 
      v-model="registerForm.mobile_phone" 
      type="tel" 
      placeholder="WhatsApp / Celular" 
      required
      v-mask="'(##) #####-####'" 
      aria-label="WhatsApp" 
      :error="errors.mobile_phone" 
    />

    <Input 
      v-model="registerForm.email" 
      type="email" 
      placeholder="E-mail" 
      required 
      aria-label="E-mail"
      :error="errors.email" 
    />

    <Input 
      v-model="registerForm.date_of_birth" 
      type="tel" 
      placeholder="Data de nascimento" 
      required
      v-mask="'##/##/####'" 
      aria-label="Data de nascimento" 
      :error="errors.date_of_birth" 
    />

    <Select 
      v-for="(curso, index) in registerForm.courses"
      :key="curso.order"
      v-model="curso.course" 
      :placeholder="`Curso - Opção ${curso.order}`"
      required 
      :options="availableOptions(index)"
      :disabled="index > 0 && !registerForm.courses[index - 1].course"
      :error="errors[`courses.${index}.course`] || ''"
    />

    <Select 
      v-model="registerForm.city" 
      placeholder="Selecione uma Cidade *" 
      required 
      aria-label="Cidade"
      :options="citiesOptions" 
      :error="errors.city"
    >
    </Select>

    <Button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Salvando...' : 'Confirmar Inscrição' }}
    </Button>
  </form>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import Select from '@/components/ui/Select.vue';
import type { RegisterForm } from '@/types/RegisterForm';
import { useContactStore } from '@/stores/contactStore';

const params = new URLSearchParams(window.location.search);

const router = useRouter();
import { computed, reactive, ref } from 'vue'

const errors = ref({})
const courseOptions = import.meta.env.VITE_COURSES.split(',').map(c => c.trim());
const citiesOptions = import.meta.env.VITE_ESCOLAS.split(',').map(c => c.trim());

const availableOptions = (index: number) => {
  const selectedCourses = registerForm.courses.map(c => c.course).filter((course, i) => i !== index && course);
  return courseOptions.filter(course => !selectedCourses.includes(course));
};



/* 
onMounted(() => {
  const params = new URLSearchParams(window.location.search);

  // 1️⃣ Verifica se há parâmetros UTM na URL e salva no localStorage
  const utmKeys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
    'msclkid'
  ];

  let hasUtm = false;
  utmKeys.forEach(key => {
    const value = params.get(key);
    if (value) {
      hasUtm = true;
      localStorage.setItem(key, value);
    }
  });

  // 2️⃣ Se a página não veio com parâmetros, tenta recuperar do localStorage
  utmKeys.forEach(key => {
    const stored = localStorage.getItem(key);
    if (stored && !registerForm[key]) {
      registerForm[key] = stored;
    }
  });

  // 3️⃣ Captura informações complementares
  registerForm.referrer = document.referrer || '';
  registerForm.landing_page = window.location.href;
}); */

const registerForm = reactive<RegisterForm>({
  name: '',
  mobile_phone: '',
  date_of_birth: '',
  courses: [
    { order: 1, course: '' },
    { order: 2, course: '' },
    { order: 3, course: '' }
  ],
  city: '',

});
/* old fields

email: '',
utm_source: '',
utm_medium: '',
utm_campaign: '',
utm_term: '',
utm_content: '',
gclid: '',
fbclid: '',
msclkid: '',
referrer: '',
landing_page: '', */


const isSubmitting = ref(false);

const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const API_URL = import.meta.env.VITE_API_URL;

async function handleSubmit() {

  try {

    isSubmitting.value = true;

    const response = await axios.post(`${API_URL}/api/contacts/`, registerForm,{
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    const contactStore = useContactStore(response.data.id);

    contactStore.setContact(response.data);

    clarity("event", "lead");

    router.push(`/completar/${response.data.id}`);     
  } catch (error: any) {
    isSubmitting.value = false;

    alert("Oops! Encontramos um erro inesperado. Por favor, tente novamente.");
    if (error.response && error.response.status === 422) {
      errors.value = Object.fromEntries(
        Object.entries(error.response.data.errors).map(([key, messages]) => [key, messages[0]])
      )
    }
  }
}
</script>
