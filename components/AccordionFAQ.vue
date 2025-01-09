<template>
    <UAccordion 
        :items="items"
        multiple
        variant="soft"
        size="xl"
        :ui="accordionUI"
    />
</template>

<script setup lang="ts">
    const items = [{
    label: "Quel est ton niveau d'étude",
    icon: 'i-heroicons-information-circle',
    content: 'Je suis diplômé ingénieur en informatique du CESI. Ce parcours m’a non seulement donné des compétences techniques solides, mais aussi une méthodologie et une démarche structurée pour mener à bien vos projets, quelle que soit leur complexité.'
    }, {
    label: 'Je ne sais pas exactement ce que je veux pour mon site web, est-ce un problème ?',
    icon: 'i-heroicons-information-circle',
    content: 'Pas du tout ! Lors d’un appel ou d’une discussion, je peux vous guider en posant les bonnes questions pour clarifier vos besoins et transformer vos idées en un projet concret.'
    }, {
    label: "Mon budget est limité, que puis-je faire ?",
    icon: 'i-heroicons-information-circle',
    content: 'Pas de souci ! Je propose des solutions adaptées à différents budgets. Lors d’un premier échange, nous pourrons définir vos priorités et trouver des options évolutives qui respectent vos contraintes financières.'
    }, {
    label: 'Est-il possible de modifier le site après la livraison ?',
    icon: 'i-heroicons-information-circle',
    content: 'Oui, je reste disponible après la livraison pour des ajustements, des mises à jour et des ajouts de fonctionnalités. Mon objectif est de garantir que votre projet évolue en même temps que vos besoins.'
    }]

    const accordionUI = {
        wrapper: 'w-full flex flex-col gap-2',
        item: {
            base: "shadow-sm", // Style de base des items
            padding: "px-6 py-4 md:mr-20", // Padding adapté pour les écrans moyens et plus
            color: "text-gray-700 dark:text-gray-200", // Couleur du texte
            size: "text-base",
        },
        default: {
            class: "text-sm sm:text-base md:text-lg font-bold whitespace-normal text-left", // Gestion des labels longs
            truncate: false, // Empêche la troncature automatique
        },
        transition: {
            enterActiveClass: "transition ease-in duration-300", // Animation d'entrée
            leaveActiveClass: "transition ease-out duration-300", // Animation de sortie
        },
    };

    
</script>

