# Guia Operacional de Cadastro de Conteudo — COTI Restaurante

> Passo a passo para o admin cadastrar um prato completo, do zero ate a publicacao.

---

## Visao Geral do Fluxo

```
1. Criar o prato (dados basicos)
   ↓
2. Adicionar ingredientes e gramaturas
   ↓
3. Descrever o passo a passo de preparo
   ↓
4. Fazer upload da imagem hero
   ↓
5. (Opcional) Fazer upload do video tutorial
   ↓
6. Publicar o prato
```

> **Importante:** O prato so pode ser publicado se tiver pelo menos **1 ingrediente**, **1 passo de preparo** e **1 imagem hero**. O sistema valida automaticamente antes de publicar.

---

## Passo 1 — Criar o Prato

1. Acesse **Painel Admin > Pratos** no menu lateral.
2. Clique em **Novo**.
3. Preencha os campos:
   - **Nome do prato** (obrigatorio): nome exato como sera exibido para a equipe.
   - **Categoria**: selecione a categoria correspondente (ex.: Entradas, Pratos Principais).
   - **Praca**: selecione a praca operacional responsavel (ex.: Fogao, Garde Manger).
   - **Descricao curta**: resumo em 1 ou 2 frases para a galeria. Seja objetivo.
   - **Rendimento**: quantidade produzida pela receita (ex.: "10 porcoes", "1 kg").
   - **Tempo de preparo (min)**: estimativa em minutos.
   - **Observacoes de montagem**: notas sobre empratamento e apresentacao final.
4. Deixe o status como **Rascunho** (voce publicara depois, quando o cadastro estiver completo).
5. Clique em **Criar Prato**.

> Apos criar, o sistema abre automaticamente a pagina de edicao onde voce continuara o cadastro.

---

## Passo 2 — Adicionar Ingredientes e Gramaturas

1. Na pagina de edicao do prato, localize a secao **"Ingredientes e Gramatura"**.
2. Clique em **Adicionar ingrediente**.
3. Para cada ingrediente, preencha:
   - **Nome do ingrediente**: nome do produto (ex.: "Cebola roxa", "File mignon").
   - **Quantidade**: valor numerico da gramatura (ex.: `200`).
   - **Unidade**: unidade de medida (ex.: `g`, `ml`, `un`, `colher de sopa`).
   - **Observacao de preparo** (opcional): detalhes de pre-preparo (ex.: "cortado em brunoise", "temperatura ambiente").
4. Para reordenar os ingredientes, use os campos de ordem ou arraste os itens.
5. Repita para todos os ingredientes da receita.
6. Clique em **Salvar ingredientes** ao finalizar.

**Dicas:**
- Liste ingredientes na ordem de uso na receita, do primeiro ao ultimo.
- Separe insumos de mise en place (pre-preparados) dos ingredientes principais.
- Sempre use gramaturas pesadas e precisas — este e o diferencial do sistema.

---

## Passo 3 — Descrever o Passo a Passo

1. Localize a secao **"Passo a Passo"** na pagina de edicao.
2. Clique em **Adicionar passo**.
3. Para cada etapa, preencha:
   - **Titulo** (opcional): nome curto do passo (ex.: "Reducao do molho").
   - **Instrucao** (obrigatorio): descricao completa e clara da etapa.
   - **Dica de tempo** (opcional): estimativa de duracao (ex.: "5 minutos", "ate dourar").
4. Adicione todos os passos em ordem sequencial de execucao.
5. Clique em **Salvar passos** ao finalizar.

**Boas praticas:**
- Seja especifico: evite instrucoes vagas como "refogar" sem detalhar temperatura e tempo.
- Use linguagem simples e direta, acessivel para colaboradores de qualquer nivel.
- Cada passo deve cobrir uma acao concreta e distinta.
- O passo final deve descrever a montagem e apresentacao no prato.

---

## Passo 4 — Upload da Imagem Hero

1. Localize a secao **"Midias"** na pagina de edicao.
2. Clique em **Upload Foto**.
3. Selecione a imagem do prato (JPEG, PNG ou WebP, maximo 5 MB).
4. O sistema comprime automaticamente a imagem antes de enviar.
5. Aguarde a mensagem de confirmacao: _"Imagem enviada com sucesso!"_.

**Requisitos da imagem:**
- Prato fotografado montado e finalizado.
- Fundo neutro, boa iluminacao.
- Proporcao recomendada: 4:3 ou 16:9.
- Consulte `docs/padrao-de-midias.md` para detalhes tecnicos.

---

## Passo 5 — Upload do Video Tutorial (Opcional, mas recomendado)

1. Na secao **"Midias"**, clique em **Upload Video**.
2. Selecione o arquivo de video (MP4 ou MOV, maximo 100 MB).
3. O upload pode demorar alguns minutos dependendo do tamanho do arquivo.
4. Apos o upload do video, o sistema **gera automaticamente uma thumbnail** a partir do primeiro frame.
5. Aguarde: _"Video enviado com sucesso! Thumbnail gerada automaticamente."_

**Boas praticas para videos:**
- Duracao ideal: 1 a 5 minutos.
- Mostre todas as etapas criticas de producao.
- Grave em 720p para equilibrar qualidade e tamanho.
- Consulte `docs/padrao-de-midias.md` para especificacoes tecnicas.

---

## Passo 6 — Publicar o Prato

1. Role a pagina ate o topo da secao **"Informacoes do Prato"**.
2. Localize o indicador de status (mostra **Rascunho** em amarelo ou **Publicado** em verde).
3. Clique no toggle para alternar para **Publicado**.
4. O sistema validara automaticamente se o prato possui:
   - **Pelo menos 1 ingrediente** cadastrado
   - **Pelo menos 1 passo de preparo** cadastrado
   - **Pelo menos 1 imagem hero** enviada
5. Se algum requisito estiver faltando, o sistema exibira uma mensagem de erro indicando o que precisa ser completado.
6. Quando tudo estiver completo, clique em **Atualizar Prato**.
7. O prato aparecera imediatamente na galeria operacional.

---

## Checklist Final Antes de Publicar

Antes de clicar em Publicar, revise:

- [ ] Nome do prato correto e sem erros de digitacao
- [ ] Categoria e praca corretas
- [ ] Todos os ingredientes com gramatura e unidade preenchidos
- [ ] Passo a passo completo e em ordem correta
- [ ] Imagem hero enviada (prato montado, boa qualidade)
- [ ] Descricao curta preenchida (aparece na galeria)
- [ ] Rendimento preenchido
- [ ] Video tutorial enviado (se disponivel)

---

## Gerenciar Conteudo Existente

### Editar um prato
1. Acesse **Pratos** no menu.
2. Clique no prato desejado.
3. Edite os campos necessarios.
4. Clique em **Atualizar Prato**.

### Despublicar um prato temporariamente
1. Acesse o prato.
2. Clique no toggle de status para retornar a **Rascunho**.
3. Clique em **Atualizar Prato**.
4. O prato deixara de aparecer para a equipe operacional imediatamente.

### Reordenar categorias e pracas
1. Acesse **Categorias** ou **Pracas** no menu.
2. Use as setas ↑ ↓ ao lado de cada item para ajustar a ordem de exibicao.
3. A ordem e salva automaticamente apos cada clique.

---

## Perguntas Frequentes

**P: O prato foi criado mas nao aparece para a equipe. O que fazer?**
R: Verifique se o status esta como **Publicado** (verde). Pratos em Rascunho sao visiveis apenas para admins.

**P: Posso publicar sem video?**
R: Sim. O video e opcional. O requisito minimo e ter imagem, ingredientes e passos.

**P: Como atualizar uma foto do prato?**
R: Faca upload de uma nova imagem na secao Midias. O sistema adicionara a nova imagem; a anterior nao e removida automaticamente.

**P: Posso editar ingredientes apos publicar?**
R: Sim. Edite e salve normalmente. A atualizacao e imediata para a equipe operacional.

**P: O sistema aceita videos do celular?**
R: Sim, desde que estejam no formato MP4 ou MOV e com tamanho inferior a 100 MB.
