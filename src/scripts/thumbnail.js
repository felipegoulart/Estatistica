export const atualizarThumb = (nomeArquivo) => {
    document.querySelector('.nomeArquivo--thumb').innerText = nomeArquivo

    document.querySelector('.textoDropzone').classList.add('esconder')
    document.querySelector('.thumbnail').classList.remove('esconder')
}

