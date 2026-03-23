<script lang="ts" setup>

import img01 from "@/assets/img-01.svg"
import img02 from "@/assets/img-02.svg"
import img03 from "@/assets/img-03.svg"

const items = [
  { src: img01 },
  { src: img02 },
  {src: img03}
]

</script>

<template>

    <v-carousel height="500px" hide-delimiter-background cycle :interval="6000" :show-arrows="false">
        <v-carousel-item
        v-for="(item,i) in items"
        :key="i"
        :src="item.src"
        cover
        ></v-carousel-item>
    </v-carousel>

</template>

<style scoped>

</style>