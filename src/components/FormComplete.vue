<template>
  <form class="flex flex-col gap-3 w-full" @submit.prevent="handleSubmit">

    <div v-if="age < 18" class="m-0 p-0">
      <span class="text-gray-700 font-medium mb-2 mt-0.5">Dados do responsável (caso menor de idade):</span>

      <Input
          required
          name="responsible_name"
          v-model="completeForm.responsible_name"
          placeholder="Nome do responsável"
          :error="errors.responsible_name"
          class="mb-3 mt-3"
      />
      <Input
          required
          name="responsible_cpf"
          v-model="completeForm.responsible_cpf"
          placeholder="CPF do responsável"
          :error="errors.responsible_cpf"
          v-mask="'###.###.###-##'"

      />


      <hr class="my-4 border-blue-200"/>

    </div>

    <div v-else>
      <Input
          name="CPF"
          required
          v-model="completeForm.cpf_cnpj"
          placeholder="CPF"
          :error="errors.cpf_cnpj"
          v-mask="'###.###.###-##'"
      />
    </div>

    <span class="text-gray-700 font-medium mb-1 mt-0.5">Endereço residencial:</span>
    <div class="flex flex-col gap-0 w-full">

      <div class="flex flex-col sm:flex-row sm:gap-2 md:mb-4 w-full">
        <Input
            name="postal_code"
            v-model="completeForm.postal_code"
            placeholder="CEP"
            class="w-full sm:basis-1/4 sm:grow-0 mb-2 sm:mb-0"
            required
            v-mask="'#####-###'"
            :error="errors.postal_code"
        />
        <Input
            name="address"
            v-model="completeForm.address"
            placeholder="Rua"
            class="w-full sm:basis-3/4 sm:grow mb-2 sm:mb-0"
            required
            :readonly="isReadOnly"
            :error="errors.address"
        />
      </div>

      <div class="flex flex-col sm:flex-row sm:gap-2 md:mb-4 w-full">
        <Input
            name="address_number"
            v-model="completeForm.address_number"
            placeholder="Número"
            class="w-full sm:basis-1/4 sm:grow-0 mb-2 sm:mb-0"
            required
            :error="errors.address_number"
        />
        <Input
            name="address_complement"
            v-model="completeForm.address_complement"
            placeholder="Complemento"
            class="w-full sm:basis-3/4 sm:grow mb-2 sm:mb-0"
            :error="errors.address_complement"
        />
      </div>

      <div class="flex flex-col sm:flex-row sm:gap-2 md:mb-4 w-full">
        <Input
            name="neighborhood"
            v-model="completeForm.neighborhood"
            placeholder="Bairro"
            class="w-full sm:basis-1/2 sm:grow-0 mb-2 sm:mb-0"
            required
            :readonly="isReadOnly"
            :error="errors.neighborhood"
        />
        <Input
            name="city"
            v-model="completeForm.city"
            placeholder="Cidade"
            class="w-full sm:basis-1/2 sm:grow-0 mb-2 sm:mb-0"
            required
            :readonly="isReadOnly"
            :error="errors.city"
        />
      </div>
    </div>

    <Button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Salvando...' : 'Concluir Cadastro' }}
    </Button>
  </form>
</template>

<script setup lang="ts">
import {reactive, onMounted, ref, watch, nextTick} from "vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import {useContactStore} from "@/stores/contactStore";
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import type {CompleteForm} from "@/types/CompleteForm";

const route = useRoute();
const router = useRouter();

const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const API_URL = import.meta.env.VITE_API_URL;

//const contactId = route.params.id as string;

//const contactStore = useContactStore(route.params.id);

const completeForm = reactive<CompleteForm>({
  email: '',
  responsible_name: '',
  responsible_cpf: '',
  cpf_cnpj: '',
  postal_code: '',
  address: '',
  address_number: '',
  address_complement: '',
  neighborhood: '',
  city: '',
});

/*
onMounted(() => {
  if (!contactStore.contact || contactStore.contact.id !== contactId) {
    console.warn("Contato não encontrado no store, redirecionando para /404...");
    router.push("/404");
  }
}); */

const isReadOnly = ref(false);
const isSubmitting = ref(false);

//const age = contactStore.contact.age;


watch(() => completeForm.postal_code, async (newCep) => {
  const cepOnlyDigits = newCep.replace(/\D/g, '');

  if (cepOnlyDigits.length === 8) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cepOnlyDigits}/json/`);
      if (response.data.erro) throw new Error("CEP não encontrado");

      completeForm.address = response.data.logradouro || "";
      completeForm.neighborhood = response.data.bairro || "";
      completeForm.city = response.data.localidade || "";

      isReadOnly.value = true;

      await nextTick();
    } catch (e) {
      alert(e);
      isReadOnly.value = false;
    }
  }
});

const errors = ref({})


async function handleSubmit() {
  try {
    const payload = {
      ...completeForm,
      contact_id: contactId,
    };
    isSubmitting.value = true
/*
    const response = await axios.patch(`${API_URL}/api/contacts/${contactId}`, payload, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    contactStore.setContact({
      id: response.data.id,
      name: response.data.name,
      protocol: response.data.reference,
    }); */

    router.push(`/sucesso/${contactId}`);
  } catch (error) {
    isSubmitting.value = false
    if (error.response && error.response.status === 422) {
      errors.value = Object.fromEntries(
          Object.entries(error.response.data.errors).map(([key, messages]) => [key, messages[0]])
      )
    }
  }
}
</script>
