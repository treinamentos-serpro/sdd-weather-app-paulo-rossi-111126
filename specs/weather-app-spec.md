# Especificação de Produto: Aplicação de Previsão do Tempo

## Visão Geral

A aplicação permitirá consultar informações meteorológicas por cidade, com foco em ajudar pessoas a tomar decisões cotidianas, planejar viagens e escolher dias adequados para atividades ao ar livre. A experiência oferecerá as condições atuais e a previsão para cinco dias, com temperaturas em Celsius ou Fahrenheit.

A aplicação será acessada pelo navegador, terá interface em português brasileiro e atenderá a celulares e computadores. Não será necessário criar uma conta. A fonte de dados inicialmente escolhida é o Open-Meteo; sua cobertura, limites, atribuição e termos de uso ainda precisam ser confirmados.

As personas consideradas são hipóteses a validar: pessoas que se deslocam diariamente, pessoas viajando e organizadores de atividades ao ar livre. As metas quantitativas e alguns aspectos da experiência também são propostas iniciais, não compromissos já aprovados.

**Status:** especificação detalhada para validação; ainda não aprovada para implementação de produção. As decisões listadas em Perguntas em Aberto precisam ser resolvidas e os critérios dependentes delas atualizados antes da aprovação.

## Requisitos Funcionais

- **RF-01 — Buscar cidade:** permitir que a pessoa pesquise somente pelo nome da cidade, incluindo caracteres válidos da grafia local, como acentos, apóstrofos e hífens. Não exigir que informe estado, país ou região. Uma entrada vazia não deve iniciar uma busca.
- **RF-02 — Identificar e selecionar cidade:** apresentar nos resultados o nome da cidade e, quando retornados pela busca, o estado e o país. Quando houver localidades ambíguas, permitir a seleção da cidade correta antes de apresentar seus dados meteorológicos.
- **RF-03 — Consultar condições atuais:** após a seleção de uma cidade, apresentar a temperatura atual e a condição meteorológica para essa localidade.
- **RF-04 — Consultar previsão de cinco dias:** apresentar, para hoje e os quatro dias seguintes, a temperatura mínima, a máxima e a condição meteorológica de cada dia para a cidade selecionada.
- **RF-05 — Alternar unidade de temperatura:** permitir alternar entre Celsius e Fahrenheit. A unidade inicial será Celsius.
- **RF-06 — Aplicar unidade selecionada:** apresentar todas as temperaturas das condições atuais e da previsão na unidade selecionada.
- **RF-07 — Comunicar estados da consulta:** informar quando uma busca ou consulta estiver em andamento, quando a geocodificação não retornar cidades, quando um serviço falhar e quando uma solicitação não receber resposta em até 120 segundos. Não confundir falha de serviço com cidade inexistente. Para falhas temporárias e timeout, permitir nova tentativa sem exigir que a pessoa redigite ou selecione novamente a cidade.
- **RF-08 — Tratar resposta meteorológica parcial:** apresentar os dados válidos recebidos e identificar como indisponíveis os campos ou períodos sem dados; não completar lacunas com valores inventados nem apresentar dados ausentes como atuais.
- **RF-09 — Usar fuso horário do local de acesso:** determinar o fuso horário a partir do local de acesso. Se a pessoa autorizar a localização do navegador, usar essa localização; se a permissão for negada ou estiver indisponível, inferir o fuso pelo endereço IP.

## Histórias de Usuário

- **US-01** — Como pessoa que se desloca diariamente, quero buscar minha cidade e consultar as condições meteorológicas atuais para me preparar antes de sair de casa. **Requisitos: RF-01, RF-03.**
- **US-02** — Como pessoa viajando para outra região, quero identificar e selecionar a cidade correta entre resultados semelhantes para consultar o clima do meu destino sem confundir localidades. **Requisito: RF-02.**
- **US-03** — Como organizador de atividade ao ar livre, quero consultar a previsão de hoje e dos quatro dias seguintes para escolher um dia viável para minha atividade. **Requisito: RF-04.**
- **US-04** — Como pessoa viajando para outra região, quero alternar entre Celsius e Fahrenheit e ver todas as temperaturas na unidade escolhida para interpretar a previsão com facilidade. **Requisitos: RF-05, RF-06.**
- **US-05** — Como pessoa que se desloca diariamente, quero receber avisos sobre carregamento, ausência de resultados ou falha e poder tentar novamente para entender o estado da consulta e obter os dados de que preciso. **Requisito: RF-07.**
- **US-06** — Como organizador de atividade ao ar livre, quero identificar quais dados da previsão estão indisponíveis para decidir com base apenas nas informações meteorológicas recebidas. **Requisito: RF-08.**
- **US-07** — Como pessoa usuária, quero ver as datas e horários no fuso do local de acesso para interpretar a previsão no meu horário local. **Requisito: RF-09.**

## Critérios de Aceite

### CA-01 — RF-01: Buscar cidade

**Dado que** o serviço de busca retorna uma cidade correspondente ao nome informado  
**Quando** a pessoa envia o nome da cidade para busca  
**Então** a aplicação apresenta a cidade retornada entre os resultados.

**Dado que** o nome informado contém espaços em branco antes ou depois do texto e corresponde a uma cidade  
**Quando** a pessoa envia a busca  
**Então** a aplicação apresenta os mesmos resultados que apresentaria para o nome sem os espaços externos.

**Dado que** o campo de busca está vazio ou contém somente espaços  
**Quando** a pessoa tenta iniciar a busca  
**Então** a aplicação não inicia a busca e informa que é necessário digitar o nome de uma cidade.

**Dado que** o nome pesquisado contém acentos, apóstrofos ou hífens válidos e corresponde a uma cidade  
**Quando** a pessoa envia a busca  
**Então** a aplicação apresenta a cidade correspondente e preserva a grafia recebida nos dados da localidade.

### CA-02 — RF-02: Identificar e selecionar cidade

**Dado que** os resultados da busca incluem o nome da cidade e os dados de região ou país disponíveis  
**Quando** a aplicação apresenta os resultados  
**Então** cada resultado exibe o nome da cidade e, quando esses dados estiverem presentes na resposta, o estado e o país correspondentes.

**Dado que** a busca retorna mais de uma cidade possível  
**Quando** os resultados são apresentados e antes de a pessoa selecionar uma cidade  
**Então** a aplicação ainda não apresenta dados meteorológicos de nenhuma das localidades ambíguas.

**Dado que** a busca retorna mais de uma cidade possível  
**Quando** a pessoa seleciona um resultado  
**Então** a cidade selecionada fica identificada como a localidade consultada e os dados meteorológicos apresentados pertencem a essa cidade.

### CA-03 — RF-03: Consultar condições atuais

**Dado que** uma cidade foi selecionada e há condições atuais disponíveis para ela  
**Quando** os dados da consulta são apresentados  
**Então** a aplicação exibe, em uma seção associada ao nome da cidade selecionada, a temperatura atual e a condição meteorológica recebidas.

### CA-04 — RF-04: Consultar previsão de cinco dias

**Dado que** uma cidade foi selecionada e o cenário de teste define a data de referência como 2026-11-11  
**Quando** a aplicação apresenta a previsão para essa cidade  
**Então** são exibidos exatamente cinco dias consecutivos, de 2026-11-11 a 2026-11-15, cada um identificado por sua data e com as temperaturas mínima e máxima e a condição meteorológica recebidas para aquele dia.

### CA-05 — RF-05: Alternar unidade de temperatura

**Dado que** nenhuma unidade foi selecionada para a consulta atual  
**Quando** a aplicação exibe temperaturas  
**Então** as temperaturas são apresentadas em Celsius.

**Dado que** as temperaturas estão visíveis  
**Quando** a pessoa seleciona Fahrenheit  
**Então** a unidade selecionada passa a ser Fahrenheit.

**Dado que** as temperaturas estão visíveis  
**Quando** a pessoa seleciona Celsius  
**Então** a unidade selecionada passa a ser Celsius.

### CA-06 — RF-06: Aplicar unidade selecionada

**Dado que** há temperaturas nas condições atuais e nos cinco dias da previsão  
**Quando** a pessoa alterna a unidade de Celsius para Fahrenheit  
**Então** todas as temperaturas visíveis passam a usar Fahrenheit e correspondem às mesmas medições após a conversão, conforme a regra de arredondamento definida para o produto.

**Dado que** há temperaturas nas condições atuais e nos cinco dias da previsão  
**Quando** a pessoa alterna a unidade de Fahrenheit para Celsius  
**Então** todas as temperaturas visíveis passam a usar Celsius e correspondem às mesmas medições após a conversão, conforme a regra de arredondamento definida para o produto.

### CA-07 — RF-07: Comunicar estados da consulta

**Dado que** uma busca ou consulta foi enviada e ainda não há resposta  
**Quando** a solicitação está em andamento  
**Então** a aplicação apresenta um estado visível de carregamento.

**Dado que** a busca de localidades termina normalmente e retorna uma lista vazia  
**Quando** a busca termina  
**Então** a aplicação informa que nenhuma cidade correspondente foi encontrada, mantém o texto pesquisado disponível para edição e não apresenta dados meteorológicos.

**Dado que** o serviço de geocodificação ou meteorologia retorna uma falha  
**Quando** a aplicação recebe a falha  
**Então** informa que a consulta não pôde ser concluída e não comunica que a cidade inexiste.

**Dado que** a geocodificação falha temporariamente e o texto pesquisado continua disponível
**Quando** a pessoa seleciona a ação para tentar novamente
**Então** a aplicação repete a busca usando o texto preservado, sem exigir que a pessoa o redigite.

**Dado que** a cidade foi encontrada, mas o serviço meteorológico retorna uma falha temporária  
**Quando** a aplicação recebe a falha  
**Então** informa que os dados não puderam ser carregados, mantém a cidade selecionada e oferece uma ação para tentar novamente.

**Dado que** uma solicitação não recebe resposta  
**Quando** se completam 120 segundos desde o início da solicitação  
**Então** a aplicação encerra o estado de carregamento, informa que a consulta excedeu o tempo limite e oferece nova tentativa sem exigir uma nova busca.

**Dado que** uma consulta falhou e a ação de nova tentativa está disponível  
**Quando** a pessoa seleciona essa ação  
**Então** a aplicação repete a consulta para a cidade já selecionada sem exigir que a pessoa redigite ou selecione novamente a cidade.

### CA-08 — RF-08: Tratar resposta meteorológica parcial

**Dado que** a resposta meteorológica contém alguns campos ou períodos válidos e omite outros  
**Quando** a aplicação apresenta os dados da consulta  
**Então** os campos válidos são exibidos, cada campo ou período ausente é identificado como indisponível e nenhum valor ausente é substituído ou apresentado como atual.

### CA-09 — RF-09: Usar fuso horário do local de acesso

**Dado que** a pessoa autorizou o acesso à localização do navegador e a localização foi obtida  
**Quando** a aplicação determina o fuso para apresentar datas e horários  
**Então** usa o fuso correspondente ao local obtido.

**Dado que** a pessoa negou a localização do navegador ou ela está indisponível, e a inferência por IP retornou um fuso horário  
**Quando** a aplicação determina o fuso para apresentar datas e horários  
**Então** usa o fuso retornado com base no IP.

## Requisitos Não Funcionais

- **RNF-01 — Responsividade:** as funções principais devem estar disponíveis em larguras de tela de 320 px a 1920 px, sem rolagem horizontal.
- **RNF-02 — Usabilidade:** em validação com usuários, uma pessoa que se desloca diariamente deve conseguir consultar as condições atuais em até 30 segundos, e um organizador de atividade ao ar livre deve identificar um dia viável na previsão em até dois minutos. As metas são propostas iniciais do discovery e precisam ser validadas.
- **RNF-03 — Acessibilidade:** os fluxos de busca, seleção de cidade, consulta, alternância de unidade e tratamento de erros devem atender ao nível AA da WCAG 2.2, incluindo navegação por teclado, foco visível e nomes acessíveis para controles. A meta é uma proposta inicial a validar.
- **RNF-04 — Desempenho:** com os serviços externos disponíveis e nas condições de teste acordadas, pelo menos 95% das buscas devem apresentar os resultados de localidades em até 3 segundos após o envio do nome; após a seleção da cidade, pelo menos 95% das consultas devem apresentar as condições atuais e a previsão em até 3 segundos. As metas e as condições de medição precisam ser validadas.
- **RNF-05 — Disponibilidade:** o fluxo principal de consulta deve alcançar disponibilidade mensal de pelo menos 99,5%. A meta, o período de medição e a forma de contabilizar falhas de serviços externos precisam ser validados.
- **RNF-06 — Resiliência:** diante de falha temporária da fonte meteorológica ou de timeout, a aplicação deve informar a falha e permitir nova tentativa sem exigir que a pessoa redigite ou selecione novamente a cidade.
- **RNF-07 — Idioma:** os textos da interface devem ser apresentados em português brasileiro.

## Matriz de Rastreabilidade

| História de usuário | Requisitos funcionais | Critérios de aceite | Requisitos não funcionais relevantes |
| --- | --- | --- | --- |
| US-01 — Buscar cidade e consultar condições atuais | RF-01, RF-03 | CA-01, CA-03 | RNF-01, RNF-02, RNF-03, RNF-04, RNF-07 |
| US-02 — Identificar e selecionar cidade | RF-02 | CA-02 | RNF-01, RNF-03, RNF-04, RNF-07 |
| US-03 — Consultar previsão de cinco dias | RF-04 | CA-04 | RNF-01, RNF-02, RNF-03, RNF-04, RNF-07 |
| US-04 — Alternar e aplicar unidade de temperatura | RF-05, RF-06 | CA-05, CA-06 | RNF-01, RNF-02, RNF-03, RNF-07 |
| US-05 — Comunicar estados e permitir nova tentativa | RF-07 | CA-07 | RNF-01, RNF-03, RNF-04, RNF-06, RNF-07 |
| US-06 — Tratar resposta meteorológica parcial | RF-08 | CA-08 | RNF-03, RNF-07 |
| US-07 — Usar fuso horário do local de acesso | RF-09 | CA-09 | RNF-03, RNF-07 |

## Casos Limite

- **Entrada e busca:** a pessoa informa apenas o nome da cidade; entrada vazia, grafia com caracteres especiais e geocodificação sem resultados seguem CA-01 e CA-07. Uma cidade inexistente é tratada como ausência de resultados, não como falha do serviço.
- **Serviços externos:** falha temporária, timeout de 120 segundos, preservação da busca e nova tentativa seguem CA-07.
- **Dados incompletos:** resposta parcial segue CA-08; o conjunto de campos obrigatórios depende da decisão sobre o conteúdo meteorológico.
- **Localidade ambígua:** exigir seleção antes de mostrar clima; exibir estado e país quando retornados, conforme CA-02.
- **Fuso horário:** usar a localização do navegador quando autorizada e, caso contrário, o fuso inferido pelo IP, conforme CA-09. Se não for possível inferir o fuso por nenhuma dessas fontes, o comportamento ainda precisa ser definido.
- **Unidade e telas estreitas:** manter todas as temperaturas na unidade escolhida e as funções acessíveis sem rolagem horizontal, conforme RF-06 e RNF-01.

## Premissas

- A busca será feita somente pelo nome da cidade; não será necessário informar estado, país ou região.
- Os resultados apresentarão estado e país quando esses dados forem retornados pela busca.
- A previsão de cinco dias inclui hoje e os quatro dias seguintes.
- Celsius será a unidade inicial, com opção de alternar para Fahrenheit.
- A unidade selecionada se aplica às temperaturas atuais e às da previsão.
- O acesso será feito por navegador, sem necessidade de instalação nativa ou conta de usuário.
- Os dados meteorológicos serão fornecidos por um serviço externo, inicialmente o Open-Meteo, sem exigir chave de API.
- Consultas não exigirão autenticação e os dados da pessoa não serão persistidos em servidor.
- A interface será responsiva e em português brasileiro.
- A aplicação comunicará carregamento, ausência de resultados e falhas de consulta.
- O fuso horário seguirá o local de acesso: localização do navegador quando autorizada e inferência por IP quando negada ou indisponível.
- Cada solicitação aos serviços externos terá timeout de 120 segundos.

## Riscos
- **Fuso horário e privacidade da localização:** a localização por IP pode ser imprecisa, especialmente em redes corporativas, VPNs ou países com múltiplos fusos, e envolve processamento de informação de rede. Mitigar validando a precisão, o provedor, a finalidade e as regras de retenção antes do lançamento.

- **Dependência de serviço externo:** indisponibilidade, lentidão, limites de uso ou mudanças no serviço podem impedir consultas. Mitigação proposta: comunicar falhas claramente e permitir nova tentativa; confirmar limites e condições de uso antes do lançamento.
- **Indicador de disponibilidade fora do controle direto:** incluir falhas do provedor externo na meta mensal pode comprometer a medição. Mitigação proposta: definir previamente o que conta como indisponibilidade e validar a meta.
- **Localidade incorreta por ambiguidade:** cidades homônimas podem levar a decisões baseadas em dados de outro lugar. Mitigação: identificar região ou país e exigir seleção quando houver ambiguidade.
- **Dados percebidos como atuais apesar de desatualizados:** não há expectativa definida para frequência de atualização. Mitigação: acordar a expectativa de atualização e como ela será comunicada.
- **Dificuldade de leitura em dispositivos móveis:** conteúdo meteorológico pode ficar difícil de comparar em telas pequenas. Mitigação: validar a experiência na faixa de telas acordada.
- **Temperaturas inconsistentes:** uma conversão aplicada parcialmente pode confundir a pessoa. Mitigação: verificar a unidade em todas as temperaturas atuais e previstas após cada alternância.
- **Condições de medição não definidas:** metas de desempenho e disponibilidade podem ser difíceis de verificar sem ambiente e regras acordados. Mitigação: definir esses parâmetros antes de assumir as metas como compromissos.

## Fora de Escopo

- Criação de conta, autenticação ou armazenamento de dados pessoais em servidor.
- Aplicativo nativo para celular; o escopo considerado é uma experiência acessada pelo navegador.
- Exigir que a pessoa informe estado, país ou região junto com o nome da cidade; os resultados fornecem esse contexto quando disponível.
- Busca por código postal ou outros critérios além do nome da cidade.
- Alertas meteorológicos, notificações, mapas, histórico do clima ou recomendações automatizadas de atividades, pois não foram definidos no discovery.
- Garantias de cobertura, atualização ou disponibilidade do provedor além das metas que vierem a ser aprovadas e dos termos de uso confirmados.
- Definição de dados meteorológicos além das condições atuais e da previsão; os campos específicos permanecem em aberto.

## Perguntas em Aberto

- Quem são os usuários prioritários e quais situações de uso devem orientar o lançamento?
- Quais informações adicionais, além da temperatura e condição atual e das temperaturas mínima/máxima e condição diária já definidas, devem ser exibidas? Quais unidades seriam usadas para vento, precipitação ou outras medidas se esses campos forem incluídos?
- Como identificar uma cidade quando estado ou país não forem retornados nos resultados?
- Como determinar o fuso em países com múltiplos fusos quando a localização do navegador não for autorizada? O que fazer se a inferência por IP falhar?
- Qual provedor será usado para inferir fuso por IP e quais serão as regras de privacidade e retenção?
- Como datas e números serão formatados em pt-BR?
- A última cidade e a unidade escolhida devem persistir no dispositivo entre cidades, recargas ou sessões?
- Qual precisão e regra de arredondamento devem ser usadas para temperaturas convertidas entre Celsius e Fahrenheit?
- Quais falhas são temporárias e permitem nova tentativa?
- Quais navegadores e versões serão suportados? A faixa de 320 px a 1920 px atende aos dispositivos-alvo?
- A cobertura, os limites, a atribuição e os termos do Open-Meteo atendem ao uso pretendido?
- As metas propostas de usabilidade, desempenho (95% em até 3 segundos), disponibilidade (99,5% ao mês) e acessibilidade (WCAG 2.2 AA) são aprovadas? Qual será o método, a amostra, o ambiente e a regra de contabilização, inclusive para falhas externas?