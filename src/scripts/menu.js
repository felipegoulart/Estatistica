const body = document.querySelector('body')

const html = 
`<nav class="menu">
    <ul>
        <a href="../../index.html"><li>Início</li></a>
        <a href="../../src/pages/descritiva.html"><li>Descritiva</li></a>
        <a href="../../src/pages/probabilidade.html"><li>Probabilística</li></a>
        <a href="../../src/pages/descritiva.html"><li>Correlação</li></a>
    </ul>
</nav>`

body.innerHTML = html

const opcaoMenu = document.querySelectorAll('li')

if(document.title == 'Descritiva') {
    opcaoMenu[1].classList.add('ativa')
} else if(document.title == 'Probabilística') {
    opcaoMenu[2].classList.add('ativa')
} else if(document.title == 'Correlação') {
    opcaoMenu[3].classList.add('ativa')
} else {
    opcaoMenu[0].classList.add('ativa')
}
