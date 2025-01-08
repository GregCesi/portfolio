<template>
    <UAccordion 
        :items="items" 
        multiple
        variant="soft"
        size="xl"
        open-icon="i-heroicons-plus"
        close-icon="i-heroicons-minus"
    />
</template>

<script setup lang="ts">
    const items = [{
    label: 'Quelle est mon niveau d etude',
    icon: 'i-heroicons-information-circle',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
    }, {
    label: 'Quelles sont mes centres d interet',
    icon: 'i-heroicons-information-circle',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
    }]
</script>


