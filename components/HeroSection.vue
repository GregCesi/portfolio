<template>
    <section class="container mx-auto flex flex-col items-center justify-center z-0 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24"> 
        <div class="flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center w-full">
            <div class="flex flex-col gap-3 sm:gap-4 text-white light-shadow-text text-center max-w-4xl w-full">
                <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    Booster votre activité avec des solutions sur-mesure
                </h1>
                <div class="text-base sm:text-xl md:text-2xl space-y-1 sm:space-y-2 hidden sm:block">
                    <p class="leading-relaxed">Je conçois des solutions sur-mesure, pensées pour s'adapter</p> 
                    <p class="font-bold">à votre activité, à vos objectifs, et à votre budget.</p>
                </div>
                <div class="text-lg sm:text-xl md:text-2xl space-y-1 sm:space-y-2 hidden sm:block">
                    <p class="leading-relaxed">Mon rôle : vous accompagner à chaque étape,</p> 
                    <p>en créant un outil qui <span class="font-bold">évolue avec vous.</span></p>
                </div>


                <div class="text-base sm:text-xl md:text-2xl space-y-1 sm:space-y-2 text-balance sm:hidden">
                    Je conçois des solutions sur-mesure, pensées pour s'adapter
                    <span class="font-bold">à votre activité, à vos objectifs, et à votre budget.</span>
                </div>
                <div class="text-base sm:text-xl md:text-2xl space-y-1 sm:space-y-2 text-balance sm:hidden">
                    Mon rôle : vous accompagner à chaque étape,
                    en créant un outil qui <span class="font-bold">évolue avec vous.</span>
                </div>
                
            </div>
            <div class="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 md:gap-20 w-full max-w-3xl">
                <button 
                    class="w-full sm:w-auto flex-1 rounded-full bg-white light-shadow text-base sm:text-lg md:text-xl text-black justify-center font-bold px-6 py-3 sm:py-4 hover:scale-105 transition-transform" 

                >
                    Discutons de votre projet
                </button>
                <button 
                    class="w-full sm:w-auto flex-1 rounded-full border-2 sm:border-4 border-white light-shadow text-base sm:text-lg md:text-xl text-white justify-center bg-transparent px-6 py-3 sm:py-4 hover:scale-105 transition-transform" 

                >
                    Comment je vous accompagne ?
                </button>
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
