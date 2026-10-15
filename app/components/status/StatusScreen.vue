<template>
  <!--
    Écran seul, sur le fond étoilé et sous le header : page du mode WIP et page
    404 (EXE-177). Rien derrière le texte : ni fond, ni voile, ni ombre.
  -->
  <main class="status-screen">
    <div class="status-screen__block">
      <h1 class="status-screen__title">{{ title }}</h1>
      <div v-if="subtitle || link" class="status-screen__below">
        <p v-if="subtitle" class="status-screen__subtitle">{{ subtitle }}</p>
        <a v-if="link" :href="link.href" class="status-screen__link">{{ link.label }}</a>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  link?: { label: string; href: string }
}

defineProps<Props>()
</script>

<style scoped>
.status-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--pad-x);
}

/* Le titre seul tient le centre de l'écran : ce qui le suit est posé dessous
   sans le déplacer. */
.status-screen__block {
  position: relative;
}

.status-screen__title {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(2rem, 1rem + 4vw, 4.5rem);
  line-height: 1.2;
  letter-spacing: 0.08em;
  /* Compense l'espacement laissé après la dernière lettre : le mot reste centré. */
  padding-left: 0.08em;
  text-align: center;
  color: var(--color-ink);
}

.status-screen__below {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: min(36rem, calc(100vw - 2 * var(--pad-x)));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  margin-top: 1.25rem;
  text-align: center;
}

.status-screen__subtitle {
  font-family: var(--font-sans);
  font-size: var(--fs-body);
  line-height: 1.55;
  letter-spacing: 0.04em;
  color: var(--color-ink);
  text-wrap: balance;
}

.status-screen__link {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.9375rem;
  letter-spacing: 0.12em;
  color: var(--color-ink);
  text-decoration: underline;
  text-decoration-color: var(--color-line);
  text-underline-offset: 0.45em;
}
</style>
