<template>
  <button
      :type="type"
      :disabled="disabled"
      class="w-full bg-[#000f8e] hover:bg-[#0700ff] text-white font-bold py-3 rounded-lg transition mt-2 text-lg shadow disabled:opacity-50"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
});
</script>
