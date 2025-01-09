<template>
  <footer class="mt-12 mb-8 md:mb-0 flex flex-col">
    <div
      class="text-center flex flex-col sm:flex-row gap-4 justify-between items-center px-8 mb-4"
    >
      <!-- Nom et titre -->
      <div class="text-gray-600">
        <p class="text-lg font-semibold">Grégoire MARCHAND</p>
        <p class="text-base font-semibold">Développeur Full-Stack</p>
      </div>

      <!-- Liens vers réseaux sociaux -->
      <div class="flex justify-center space-x-4">
        <a
          href="https://www.linkedin.com/in/gr%C3%A9goire-marchand-5b8279203/"
          class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <i class="fa-brands fa-linkedin text-3xl" />
        </a>
        <a
          href="https://github.com/GregCesi"
          class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <i class="fa-brands fa-github text-3xl" />
        </a>
      </div>
    </div>

    <div class="flex flex-col items-center gap-2 sm:-translate-y-16">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        © 2025 Tous droits réservés.
      </p>
      <p class="text-xs text-gray-400">
        Design inspired by
        <a
          href="https://nicolasharter.dev/fr"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:text-gray-600 dark:hover:text-white"
        >
          Nicolas Harter </a
        >.
      </p>
    </div>
  </footer>
</template>
