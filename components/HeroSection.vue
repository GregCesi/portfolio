<template>
    <section class="container mx-auto flex flex-col items-center justify-center"> 
        <div class="flex flex-col gap-20 items-center">
            <div class="flex flex-col gap-4 text-white light-shadow-text text-center max-w-3xl">

                <div class="text-6xl font-bold">
                    Booster votre activité avec des solutions sur-mesure
                </div>
                <div class="text-2xl flex flex-col">
                    <p>Je conçois des solutions sur-mesure,  pensées pour s’adapter </p> 
                    <p class="font-bold">à votre activité,  à vos objectifs, et à votre budget.</p>
                </div>
                <div class="text-2xl flex flex-col">
                    <p>Mon rôle : vous accompagner à chaque étape,</p> 
                    <p>en créant un outil qui <span class="font-bold">évolue avec vous.</span></p>
                </div>
            </div>
            <div class="flex justify-between gap-20">
                <UButton class="flex-1 rounded-full bg-white light-shadow text-xl text-black justify-center font-bold" size="xl" variant="soft">
                    Discuton de votre projet
                </UButton>
                <UButton class="flex-1 rounded-full border-4 border-white light-shadow text-xl text-white justify-center bg-transparent" size="xl" variant="soft">
                    Comment je vous accompagne ? 
                </UButton>
            </div>
        </div>
        
    </section>
</template>

<style scoped>
.light-shadow {
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 0.7);
}

.light-shadow-text {
  /* décalage-X | décalage-Y | blur-radius | couleur */
  text-shadow: 0px 0px 15px rgba(255, 255, 255, 0.7);
}
</style>
