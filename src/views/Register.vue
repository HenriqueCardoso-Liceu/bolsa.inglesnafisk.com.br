<template>
  <AppLayout>
    <Card class="max-w-md w-full">
      <h2 class="text-2xl font-bold text-gray-800 mb-3 text-center">Inscreva-se!</h2>
      <p class="text-sm text-gray-500 font-medium text-center mb-6">
        Preencha todos os campos abaixo para <br/>
        concorrer a <span class="font-bold text-blue-800">Bolsa de Estudo 100% Grátis</span>.
      </p>

      <FormRegister/>

      <div class="w-full flex flex-col justify-center items-center gap-4 mt-4 px-2">
        <div class="flex flex-wrap items-center text-center gap-4">
          <Badge>+12.000 bolsas já concedidas.</Badge>
        </div>
      </div>
    </Card>
  </AppLayout>
</template>

<script setup>
import FormRegister from '@/components/FormRegister.vue';
import AppLayout from "@/layout/AppLayout.vue";
import Card from "@/components/ui/Card.vue";

import Badge from "@/components/ui/Badge.vue";
</script>