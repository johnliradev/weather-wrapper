# Projeto de Previsão do Tempo com Redis

Este é um projeto simples que desenvolvi para aprender a utilizar o Redis como cache em aplicações Node.js. Ele faz requisições para uma API de previsão do tempo e armazena as respostas no Redis, melhorando a performance e reduzindo chamadas desnecessárias à API externa.

## Funcionalidades

- Consulta a previsão do tempo de uma cidade.
- Utiliza o Redis para armazenar e recuperar previsões já consultadas.
- Responde mais rápido quando a informação já está em cache.
