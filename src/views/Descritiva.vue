<template>
    <div id="descritiva">
        <InputDados />
    </div>
</template>


<script>
import InputDados from '@/components/InputDados'

export default {
    name: 'descritiva',

    components: {
        InputDados,
    },

    data () {
        return {
            dados: {
                nomeVariavel: '',
                vetorValores: [],
                tipoVariavel: '',
                tipoCalculo: ''
            }
        }
    }
}
</script>