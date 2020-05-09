<template>
    <div class="root">
        <Header/>
        <img :src="logo" width="200" height="200">
    </div>
</template>

<script>
    import VueImage from './vue.png'
    import Header from './components/Header'

    export default {
        components: {
            Header,
        },
        data: () => ({
            logo: VueImage
        }),
    }
</script>

<style scoped lang="css">
    .root {
        display: flex;
        flex-direction: column;
        height: 100vh;
        align-items: center;
        justify-content: center;
    }
</style>