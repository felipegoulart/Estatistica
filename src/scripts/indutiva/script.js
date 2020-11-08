const tiposDistribuicoes = document.querySelectorAll('.tiposDistribuicoes')
const distribuicoes = document.querySelectorAll('.distribuicao')

tiposDistribuicoes.forEach(li => {
  li.addEventListener('click', () => {
    function revelarElemento(elemento) {
      distribuicoes.forEach(div => {
        if(!div.classList.contains('esconder')) div.classList.add('esconder')
        
        document.querySelector(`.dist${elemento}`).classList.remove('esconder')
    })}
    revelarElemento(li.innerHTML)
    
    tiposDistribuicoes.forEach(li => {
      if(li.classList.contains('selecionado')) li.classList.remove('selecionado')
    })

    li.classList.add('selecionado')
  })
})