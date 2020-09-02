<template>
  <div id="content">
    <form autocomplete="off" @submit="calcular">

      <div class="inputRadio">
        <input type="radio" name="tipoEntrada" id="manual" value="manual" v-model="tipoEntrada">
        <label for="manual">Manual</label>
      </div>

      <div class="inputRadio">
        <input type="radio" name="tipoEntrada" id="arquivo" value="arquivo"  v-model="tipoEntrada">
        <label for="arquivo">Arquivo</label>
      </div>

      <div id="inputDado">
        <textarea v-if="tipoEntrada === 'manual'" v-model="dadosManual" type="text" id="arquivo"></textarea>
        <input v-if="tipoEntrada === 'arquivo'" v-on:change="pegarArquivo" type="file" id="arquivo" accept=".csv">
      </div>

      <input type="text" name="Variavel" id="variavel" placeholder="Nome da Variavel">

      <select v-model="entradaDados.tipoVar">
        <option disabled> Selecione o Tipo de Variável</option>
        <option>Qualitativa Nominal</option>
        <option>Qualitativa Ordinal</option>
        <option>Quantitativa Discreta</option>
        <option>Quantitativa Continua</option>
      </select>

      <select name="calculo" v-model="entradaDados.tipoCalc">
        <option disabled>Selecione o Tipo de Calculo</option>
        <option value="amostra">Amostra</option>
        <option value="populacao">População</option>
      </select>

      <input type="submit" value="Calcular">
    </form>

  </div>
</template>

<script>
export default {
  data () {
    return {
      dadosManual: '',
      dadosArq: '',
      entradaDados: {
        vetorVariaveis: [null],
        nomeVar: null,
        tipoVar: 'Selecione o Tipo de Variável',
        tipoCalc: 'Selecione o Tipo de Calculo',
      },
      tipoEntrada: '',
    }
  },
  methods : {
    pegarArquivo () {
        const arquivo = event.target.files[0]
        let reader = new FileReader();

        reader.onload = () => {
          this.dadosArq = reader.result.split('\n')
          this.entradaDados.vetorVariaveis = this.dadosArq.filter(dado => dado !== '')
        }
        reader.readAsText(arquivo)
      },
    calcular() {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scooped>
  div #content {
      display: flex;
      width: 100vw;
      height: 100vh;
      background-color: #eee;
      justify-content: center;
      align-items: center;
  }

  select {
    border: none;
    background: #eee;
  }
</style>
