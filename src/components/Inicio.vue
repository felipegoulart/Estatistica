<template>
  <div>
    <form action="">
        <input @change="carregarArquivo" type="file" id="arquivo" accept=".csv">
        <button @click="limparDados">teste</button>
    </form>
    <h1>
        Trabalho grupo 1
    </h1>
  </div>
</template>

<script>
export default {
  data (){
    return {
      dados: {lista: []}
    }
  },
  methods : {
    carregarArquivo () {
      const arquivo = event.target.files[0]
      let reader = new FileReader();

      reader.onload = () => {
        this.dados.lista = reader.result.split('\n')
        console.log(this.dados.lista);
      }
      reader.readAsText(arquivo)
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
  div {
      display: flex;
      width: 100vw;
      height: 100vh;
      background-color: #eee;
      justify-content: center;
      align-items: center;
  }
  h1{
      font-size: 40pt;
      color: #222;
      font-family: sans-serif;
      text-transform: uppercase;
      text-align: center;
  }
</style>
