<script setup lang="ts"></script>
<template>
    <div class="container-main flex justify-center items-center"> 
        <slot></slot>
    </div>
</template>

<style scoped>

.container-main {
    background-color: #EEEEEE;
    background-image: url(/assets/img-background-principal.jpg);
    width: 100%;
    height: 100dvh;
    object-fit: cover;
    background-size: cover;
    background-repeat: no-repeat;
    overflow: hidden;
}

/* .container-main::before {
    content: '';
    position: absolute;
    backdrop-filter: blur(4px);
    background: rgba(255, 255, 255, 0.2);
    width: 100%;
    height: 100%;
} */

</style>