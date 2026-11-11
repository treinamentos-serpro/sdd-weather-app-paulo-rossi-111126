# Discovery: Aplicação de Previsão do Tempo

## Contexto

A empresa solicitou uma aplicação para consultar informações meteorológicas por cidade. A experiência deve permitir que usuários encontrem uma cidade, consultem as condições atuais e vejam a previsão dos próximos cinco dias. A aplicação também deve oferecer temperaturas em Celsius ou Fahrenheit e funcionar em dispositivos móveis.

Ainda não estão definidos o público-alvo específico, as plataformas e as metas de qualidade. Os critérios quantitativos abaixo são propostas iniciais e precisam ser validados antes do planejamento técnico.

## Personas

As personas abaixo são hipóteses iniciais e devem ser validadas com usuários reais.

| Persona | Objetivo principal | Contexto de uso | Métrica de sucesso |
| --- | --- | --- | --- |
| **Pessoa que se desloca diariamente** | Saber rapidamente como estará o tempo antes de sair de casa. | Principalmente no celular, pela manhã ou antes do trajeto. | Consultar o clima atual e a previsão relevante em até 30 segundos, sem precisar consultar outra fonte. |
| **Pessoa viajando para outra região** | Consultar o clima de uma cidade de destino e entender as temperaturas na unidade que costuma usar. | No celular durante a viagem; no desktop durante o planejamento. | Encontrar a cidade correta e interpretar a previsão de cinco dias sem confusão de localidade ou unidade. |
| **Organizador de atividade ao ar livre** | Escolher um dia adequado para uma atividade planejada nos próximos dias. | Principalmente no desktop durante o planejamento; no celular para consultas rápidas. | Consultar a previsão de cinco dias da cidade e identificar um dia viável em até dois minutos. |

## Decisões

- **Fonte de dados — Open-Meteo, sem API key:** escolhida para fornecer dados meteorológicos sem exigir uma chave de API. Resolve a escolha inicial do provedor e a necessidade de credenciais; limites, cobertura, atribuição e termos de uso ainda precisam ser confirmados.
- **Período da previsão — hoje + 4 dias:** os cinco dias incluem o dia atual e os quatro dias seguintes. Resolve a ambiguidade sobre a contagem dos dias da previsão.
- **Unidade padrão — Celsius:** as temperaturas serão apresentadas inicialmente em Celsius, mantendo a opção de alternar para Fahrenheit. Resolve a escolha da unidade inicial.
- **Busca e identificação de cidade:** a pessoa pesquisará somente pelo nome da cidade, sem precisar informar estado, país ou região. Os resultados apresentarão o nome da cidade e, quando disponíveis, estado e país para distinguir localidades.
- **Fuso horário — local de acesso:** datas e horários seguirão o fuso do local de acesso. A proposta é usar a localização do navegador quando autorizada e inferir o fuso por IP quando a permissão for negada ou a localização estiver indisponível. Precisão, países com múltiplos fusos e privacidade do fallback ainda precisam ser validados.
- **Timeout — 2 minutos:** cada solicitação a serviços externos será considerada expirada após 120 segundos sem resposta; a aplicação informará a demora e permitirá nova tentativa sem exigir uma nova busca.
- **Sem autenticação e sem persistência de servidor:** consultas não exigirão conta e dados do usuário não serão persistidos no servidor. Resolve as decisões sobre login e armazenamento no servidor; persistência local no dispositivo ainda não foi definida.
- **Idioma da interface — pt-BR:** textos da interface serão apresentados em português brasileiro. Resolve a escolha do idioma da UI; formatação de datas e números ainda precisa ser definida.

## Requisitos Funcionais

- **RF-01 — Buscar cidade:** o usuário deve poder pesquisar uma cidade pelo nome.
- **RF-02 — Identificar a cidade:** os resultados devem apresentar o nome da cidade e, quando disponíveis, estado e país. Quando houver resultados ambíguos, a pessoa deve poder selecionar a localidade correta; não é necessário informar estado, país ou região na busca.
- **RF-03 — Consultar clima atual:** após selecionar uma cidade, o usuário deve poder visualizar a temperatura atual e a condição meteorológica.
- **RF-04 — Consultar previsão:** o usuário deve poder visualizar, para hoje e os quatro dias seguintes, a temperatura mínima, a máxima e a condição meteorológica de cada dia.
- **RF-05 — Alternar unidade:** o usuário deve poder alternar entre Celsius e Fahrenheit.
- **RF-06 — Atualizar apresentação:** a unidade selecionada deve ser aplicada às temperaturas do clima atual e da previsão.
- **RF-07 — Informar estados da consulta:** a aplicação deve comunicar carregamento, busca sem resultados, falha de serviço e timeout de 120 segundos; para falhas temporárias, deve permitir nova tentativa sem exigir nova busca.
- **RF-08 — Tratar resposta meteorológica parcial:** apresentar os dados válidos e identificar campos ou períodos ausentes como indisponíveis, sem inventar valores nem apresentar dados ausentes como atuais.
- **RF-09 — Usar fuso horário do local de acesso:** determinar o fuso do local de acesso pela localização do navegador quando autorizada e, se negada ou indisponível, inferi-lo pelo IP.

## Requisitos Não-Funcionais

- **RNF-01 — Responsividade:** as funções principais devem estar disponíveis em telas de 320 px a 1920 px de largura, sem rolagem horizontal.
- **RNF-02 — Usabilidade:** busca, seleção da cidade e alternância de unidade devem ser compreensíveis e acessíveis sem instruções externas.
- **RNF-03 — Acessibilidade:** a interface deve atender ao nível AA da WCAG 2.2, incluindo navegação por teclado, foco visível e nomes acessíveis para controles.
- **RNF-04 — Desempenho:** em ambiente de teste acordado e com o serviço meteorológico disponível, 95% das consultas devem exibir os resultados em até 3 segundos após o envio da busca. A meta e as condições de teste são propostas iniciais a validar.
- **RNF-05 — Disponibilidade:** o fluxo de consulta de clima deve alcançar disponibilidade mensal de pelo menos 99,5%. A meta e o tratamento de falhas de serviços externos são propostas iniciais a validar.
- **RNF-06 — Resiliência:** quando a fonte meteorológica estiver indisponível, a aplicação deve informar a falha e permitir nova tentativa sem exigir que o usuário redigite a cidade pesquisada.

## Riscos

- **Dependência de serviço externo:** indisponibilidade, latência, limites de uso ou mudanças na fonte de dados podem impedir buscas ou consultas.
- **Fuso horário e privacidade do IP:** inferência por IP pode ser imprecisa, especialmente em redes corporativas, VPNs ou países com múltiplos fusos, e envolve processamento de informação de rede. Validar precisão, provedor, finalidade e retenção antes do lançamento.
- **Medição de disponibilidade:** contabilizar falhas da API meteorológica na meta mensal pode tornar o indicador dependente de um serviço fora do controle da empresa.
- **Ambiguidade na busca:** cidades com nomes iguais ou semelhantes podem levar à exibição de dados para a localidade errada.
- **Frescor dos dados:** sem uma expectativa definida para atualização, os usuários podem interpretar dados desatualizados como atuais.
- **Experiência móvel limitada:** informações meteorológicas podem ficar difíceis de comparar ou ler em telas pequenas se a hierarquia visual não for adequada.
- **Conversão de unidades inconsistente:** a alternância pode exibir valores incompatíveis entre o clima atual e a previsão se não for aplicada a todas as temperaturas.

## Perguntas em Aberto

- Quem são os usuários principais e em quais situações consultarão a aplicação?
- Como identificar uma cidade quando estado ou país não forem retornados nos resultados?
- Quais informações adicionais, além da temperatura e condição atual e das temperaturas mínima/máxima e condição diária já definidas, devem aparecer? Quais unidades serão usadas para vento, precipitação ou outras medidas se forem incluídos?
- Quais unidades devem ser usadas para vento, precipitação e outras medidas?
- Com que frequência os dados devem ser atualizados?
- Quais são os limites, a cobertura, as exigências de atribuição e os termos de uso do Open-Meteo?
- Quais navegadores e versões devem ser suportados? A faixa de 320 px a 1920 px atende aos dispositivos-alvo?
- Como determinar o fuso em países com múltiplos fusos quando a localização do navegador não for autorizada? O que fazer se a inferência por IP falhar?
- Qual provedor será usado para inferir fuso por IP e quais serão as regras de privacidade e retenção?
- Como será definida a formatação regional de datas e números em pt-BR?
- A aplicação deve preservar a última cidade consultada no dispositivo entre visitas ou sessões?
- As metas iniciais de desempenho (95% das consultas em até 3 segundos), disponibilidade (99,5% ao mês) e conformidade WCAG 2.2 AA são aceitáveis?
- Falhas da fonte meteorológica devem contar no cálculo da disponibilidade mensal? Qual conexão e ambiente de teste serão usados para medir desempenho?

## Suposições

- A busca será feita por nome de cidade.
- A pessoa não precisará informar estado, país ou região; os resultados apresentarão estado e país quando esses dados estiverem disponíveis.
- O fuso horário seguirá o local de acesso, com localização do navegador quando autorizada e inferência por IP quando negada ou indisponível, sujeito à validação de precisão e privacidade.
- Cada solicitação aos serviços externos terá timeout de 120 segundos.
- A alternância entre Celsius e Fahrenheit afetará as temperaturas exibidas tanto no clima atual quanto na previsão.
- A aplicação será acessada por navegador, sem necessidade de instalação nativa.
- Os dados serão obtidos de um serviço meteorológico externo.
- A aplicação não exigirá conta de usuário para realizar consultas.
- O suporte a dispositivos móveis implica interface responsiva, mas as dimensões e navegadores mínimos ainda serão definidos.
- Mensagens de carregamento, erro e ausência de resultados são necessárias para tornar as consultas compreensíveis; o texto e as ações específicas devem ser definidos durante o design.
