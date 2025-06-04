<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-between">
    <!-- Header -->
    <header class="bg-white shadow-md py-4">
      <div class="container mx-auto flex justify-between items-center px-6">
        <h1 class="text-2xl font-bold text-primary-600">Mon Portfolio</h1>
        <nav>
          <ul class="flex space-x-4">
            <li><a href="#hero" class="text-gray-700 hover:text-primary-600">Accueil</a></li>
            <li><a href="#values" class="text-gray-700 hover:text-primary-600">Valeurs</a></li>
            <li><a href="#roadmap" class="text-gray-700 hover:text-primary-600">Roadmap</a></li>
            <li><a href="#solutions" class="text-gray-700 hover:text-primary-600">Solutions</a></li>
            <li><a href="#stack" class="text-gray-700 hover:text-primary-600">Stack</a></li>
            <li><a href="#about" class="text-gray-700 hover:text-primary-600">À propos</a></li>
            <li><a href="#contact" class="text-gray-700 hover:text-primary-600">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section id="hero" class="flex-1 flex items-center justify-center bg-gradient-to-r from-primary-500 to-primary-700 text-white">
      <div class="text-center px-6">
        <h2 class="text-4xl md:text-5xl font-bold mb-4">Offrez un accueil clair à votre activité</h2>
        <p class="text-lg mb-6">Je conçois des interfaces sur-mesure, pertinentes pour s’adapter à votre structure, à vos objectifs, et à votre budget.</p>
        <p class="text-lg mb-6">Mon rôle : vous accompagner à chaque étape, en créant un récit qui évolue avec vous.</p>
        <a href="#contact" class="bg-white text-primary-700 px-4 py-2 rounded shadow hover:bg-gray-100">Contactez-moi</a>
      </div>
    </section>

    <!-- Valeurs Ajoutées -->
    <section id="values" class="py-16 bg-white">
      <div class="container mx-auto px-6">
        <h3 class="text-3xl font-bold text-center mb-8">Travailler ensemble, ça donne quoi ?</h3>
        <p class="text-gray-700 text-center max-w-2xl mx-auto">Être à l’écoute pour comprendre quelque chose qui a du sens. Je prends le temps de comprendre votre activité, vos enjeux réels, vos objectifs…</p>
        <p class="text-gray-700 text-center max-w-2xl mx-auto">Des solutions pensées pour évoluer, pas pour être jetées. Grâce à cette compréhension en amont, je choisis des technologies et des solutions adaptées.</p>
        <p class="text-gray-700 text-center max-w-2xl mx-auto">Votre site ne doit pas juste être « beau » : il doit bosser pendant que vous dormez.</p>
      </div>
    </section>

    <!-- Roadmap Client -->
    <section id="roadmap" class="py-16 bg-gray-100">
      <div class="container mx-auto px-6">
        <h3 class="text-3xl font-bold text-center mb-8">Roadmap Client</h3>
        <ul class="text-gray-700 max-w-2xl mx-auto list-disc list-inside">
          <li>Premier contact : un formulaire, un mail, un message.</li>
          <li>Échange découverte (15–30 min) : clarifier vos besoins, objectifs, contraintes et vision.</li>
          <li>Proposition personnalisée : offre sous forme de document (diagnostic, solutions, livrables, planning, budget).</li>
          <li>Lancement & expérimentation : démarrage en mode agile avec un MVP.</li>
          <li>Livraisons & déploiement : mise en production, configuration, suivi post-lancement.</li>
        </ul>
      </div>
    </section>

    <!-- Mes Solutions -->
    <section id="solutions" class="py-16 bg-white">
      <div class="container mx-auto px-6">
        <h3 class="text-3xl font-bold text-center mb-8">Des solutions adaptées à vos besoins</h3>
        <p class="text-gray-700 text-center max-w-2xl mx-auto">Je propose plusieurs typologies de réponses : sites vitrines, e-commerce, applications mobiles, CMS statiques, microsites de campagne, etc.</p>
        <p class="text-gray-700 text-center max-w-2xl mx-auto">SEO & performance : optimisation du chargement, de la structure du code et du contenu pour maximiser visibilité et UX.</p>
      </div>
    </section>

    <!-- Stack Technologique -->
    <section id="stack" class="py-16 bg-gray-100">
      <div class="container mx-auto px-6">
        <h3 class="text-3xl font-bold text-center mb-8">Stack Technologique</h3>
        <p class="text-gray-700 text-center max-w-2xl mx-auto">Front-end : HTML / CSS / Tailwind CSS / TypeScript / JavaScript / Vue / React / Angular</p>
        <p class="text-gray-700 text-center max-w-2xl mx-auto">Back-end & logique métier : Java (Spring Boot) / Node.js (Express) + Supabase + API REST</p>
        <p class="text-gray-700 text-center max-w-2xl mx-auto">Outils & librairies : Git / GitHub Actions / Docker / CircleCI / Jenkins / Vercel</p>
      </div>
    </section>

    <!-- À Propos de Moi -->
    <section id="about" class="py-16 bg-white">
      <div class="container mx-auto px-6">
        <h3 class="text-3xl font-bold text-center mb-8">À propos de moi</h3>
        <p class="text-gray-700 text-center max-w-2xl mx-auto">Je m’appelle Grégoire, développeur web full-stack. Ce qui m’anime : créer des expériences utiles, esthétiques et performantes.</p>
        <p class="text-gray-700 text-center max-w-2xl mx-auto">Méthodes : agile (sprints, Kanban), tests automatisés, revue de code.</p>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16 bg-white">
      <div class="container mx-auto px-6">
        <h3 class="text-3xl font-bold text-center mb-8">Contactez-moi</h3>
        <form class="max-w-lg mx-auto">
          <div class="mb-4">
            <label for="name" class="block text-gray-700">Nom</label>
            <input type="text" id="name" class="w-full px-4 py-2 border rounded">
          </div>
          <div class="mb-4">
            <label for="email" class="block text-gray-700">Email</label>
            <input type="email" id="email" class="w-full px-4 py-2 border rounded">
          </div>
          <div class="mb-4">
            <label for="message" class="block text-gray-700">Message</label>
            <textarea id="message" class="w-full px-4 py-2 border rounded h-32"></textarea>
          </div>
          <button type="submit" class="bg-primary-600 text-white px-4 py-2 rounded shadow hover:bg-primary-700">Envoyer</button>
        </form>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-4">
      <div class="container mx-auto text-center">
        <p>&copy; 2025 Grégoire Marchand. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Script setup can be used for interactivity if needed
</script>

<style scoped>
/* Custom styles for the new design */
</style>