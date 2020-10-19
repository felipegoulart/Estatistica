const sectionResultados = document.querySelector('.resultados')
const calcularIndutiva = document.querySelector('#calcularIndutia')
let probabilidade, media, dp

calcularIndutiva.addEventListener('click', () => {
    const amostra = document.querySelector('#amostra').value
    const sucesso = document.querySelector('#sucesso').value
    const fracasso = document.querySelector('#fracasso').value
    const evento = document.querySelector('#evento').value
})


const resultados = `
    <p>Probabilidade: ${probabilidade}</p>
    <p>Média: ${media}</p>
    <p>Desvio Padrão: ${dp}</p>`

sectionResultados.innerHTML = resultados