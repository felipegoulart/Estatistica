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
        <textarea v-if="tipoEntrada === 'manual'" v-model="dados.lista" type="text" id="arquivo"></textarea>
        <input v-if="tipoEntrada === 'arquivo'" v-on:change="dados.lista" type="file" id="arquivo" accept=".csv">
      </div>
      <input type="text" name="Variavel" id="variavel" placeholder="Nome da Variavel">
      <select v-model="tipoVariavel">
        <option disabled> Selecione o Tipo de Variável</option>
        <option>Qualitativa Nominal</option>
        <option>Qualitativa Ordinal</option>
        <option>Quantitativa Discreta</option>
        <option>Quantitativa Continua</option>
      </select>
      <select name="calculo" v-model="tipoCalculo">
        <option disabled>Selecione o Tipo de Calculo</option>
        <option value="amostra">Amostra</option>
        <option value="populacao">População</option>
      </select>
      <input type="submit" value="Calcular">

    </form>
    {{ dados.lista}}
  </div>
</template>

<script>
export default {
  data () {
    return {
      dados: {lista: ''},
      tipoEntrada: '',
      tipoVariavel: 'Selecione o Tipo de Variável',
      tipoCalculo: 'Selecione o Tipo de Calculo'
    }
  },
  methods : {
    calcular () {
      if(this.tipoEntrada === 'arquivo') {
        const arquivo = event.target.files[0]
        let reader = new FileReader();
  
        reader.onload = () => {
          this.dados.lista = reader.result.split('\n')
          console.log(this.dados.lista);
        }
        reader.readAsText(arquivo)
      }
      },
    limparDados () {
      const listaDados = this.dados.lista.filter(dado => dado !== '')
      console.log(listaDados);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div #content {
      display: flex;
      width: 100vw;
      height: 100vh;
      background-color: #eee;
      justify-content: center;
      align-items: center;
  }

  h1 {
      font-size: 40pt;
      color: #222;
      font-family: sans-serif;
      text-transform: uppercase;
      text-align: center;
  }
</style>
