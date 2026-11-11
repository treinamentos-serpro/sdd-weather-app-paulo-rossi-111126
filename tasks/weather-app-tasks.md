# Backlog de Tarefas: Weather App

Tarefas derivadas de `plans/weather-app-plan.md` e rastreáveis a `specs/weather-app-spec.md`. Os IDs são referências estáveis; a ordem abaixo segue as camadas de implementação. A execução deve respeitar as dependências explícitas de cada tarefa.

## Entrega 1: Tipos e funções puras

### T-01 — Definir os tipos de domínio
- **Descrição:** Criar contratos TypeScript para cidade, dados atuais, previsão diária, previsão completa e unidade.
- **Critérios de aceite:** `City`, `CurrentWeather`, `ForecastDay`, `WeatherData` e `Unit` expõem os campos e nulabilidade definidos no plano; o modelo usa Celsius; `tsc --noEmit` conclui sem erros; nenhum tipo de payload HTTP é exportado como tipo de domínio.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `src/types/weather.ts`
- **Tipo:** Data

### T-02 — Implementar conversões de temperatura
- **Descrição:** Criar funções puras de conversão entre Celsius e Fahrenheit e formatação numérica.
- **Critérios de aceite:** Celsius para Fahrenheit calcula `C * 9 / 5 + 32` e o inverso `(F - 32) * 5 / 9`; `null` continua `null`; valores convertidos não são arredondados antes da formatação.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/temperature.ts`
- **Tipo:** Data

### T-03 — Implementar descrições de códigos meteorológicos
- **Descrição:** Mapear códigos WMO para descrições em pt-BR, incluindo códigos desconhecidos.
- **Critérios de aceite:** Cada código WMO listado como suportado no módulo retorna descrição não vazia em pt-BR; um código fora da tabela retorna fallback sem lançar exceção.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/weatherCode.ts`
- **Tipo:** Data

### T-04 — Implementar funções de data e fuso
- **Descrição:** Criar funções puras para interpretar e formatar datas/horários usando o fuso fornecido.
- **Critérios de aceite:** As funções recebem data, fuso IANA e locale explicitamente; a mesma entrada produz a mesma data/hora independentemente do fuso do host; identificador IANA inválido resulta em `RangeError`, sem substituir pelo fuso do host.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/dateTime.ts`
- **Tipo:** Data

### T-05 — Implementar o mapeador de previsão
- **Descrição:** Converter a resposta externa validada para `WeatherData`, preservando lacunas como valores indisponíveis.
- **Critérios de aceite:** Mapeia cidade, fuso, clima atual, `retrievedAt` ISO e no máximo cinco entradas diárias; combina campos pelo mesmo índice; campo meteorológico ausente vira `null`; valor presente com tipo inválido ou estrutura obrigatória inválida gera erro; `retrievedAt` não usa `current.time`.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/openMeteoMapper.ts`
- **Tipo:** Data

## Entrega 2: Services

### T-06 — Aprovar integração de fuso e regras de privacidade
- **Descrição:** Resolver fornecedor, dados enviados, retenção e fallback para conversão de coordenadas/IP em fuso IANA.
- **Critérios de aceite:** Spec e plano registram nome do fornecedor, dados transmitidos, retenção, fluxo para permissão concedida/negada e comportamento quando ambos os métodos falham; aprovação do responsável de produto/privacidade está registrada; sem aprovação T-09 permanece bloqueada.
- **Dependências:** Nenhuma; bloqueia T-09.
- **Arquivos prováveis:** `specs/weather-app-spec.md`, `plans/weather-app-plan.md`
- **Tipo:** Infra

### T-07 — Implementar o serviço de geocodificação
- **Descrição:** Consultar o Open-Meteo pelo nome da cidade e normalizar resultados para `City`.
- **Critérios de aceite:** Requisição contém `name` codificado, `count=10`, `language=pt` e `format=json`; `admin1`/`country` ausentes viram `null`; `results` ausente vira `[]`; HTTP não-2xx, rejeição de rede, JSON inválido e timeout produzem erros distinguíveis; timeout é configurado para 120 segundos.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/services/geocodingService.ts`
- **Tipo:** Data

### T-08 — Implementar o serviço de previsão
- **Descrição:** Consultar Open-Meteo para a cidade selecionada e o fuso informado.
- **Critérios de aceite:** URL contém latitude/longitude, `current=temperature_2m,weather_code`, campos diários definidos no plano, `forecast_days=5`, `temperature_unit=celsius` e timezone IANA; timeout configurado em 120 segundos; HTTP não-2xx falha; payload passa pelo mapeador; uma chamada não gera retry automático.
- **Dependências:** T-01, T-05.
- **Arquivos prováveis:** `src/services/weatherService.ts`
- **Tipo:** Data

### T-09 — Implementar o serviço de resolução do fuso
- **Descrição:** Obter coordenadas pela Geolocation API e aplicar o fluxo aprovado de resolução e fallback.
- **Critérios de aceite:** Callback de geolocalização bem-sucedido envia as coordenadas obtidas ao resolvedor aprovado; negação/indisponibilidade chama fallback aprovado; sucesso retorna timezone IANA; falha de todos os métodos retorna erro definido na decisão T-06 e nunca usa timezone da cidade consultada.
- **Dependências:** T-06.
- **Arquivos prováveis:** `src/services/timeZoneService.ts`
- **Tipo:** Data

## Entrega 3: Hook de orquestração

### T-10 — Implementar busca e estado de geocodificação no hook
- **Descrição:** Iniciar `useWeatherApp` com estado/reducer da busca, submissão, resultados e erros de geocodificação.
- **Critérios de aceite:** Estado inicial é idle; submissão válida transita loading para success, empty ou error conforme o serviço; vazio não chama o serviço; query permanece disponível após erro; nenhum serviço de fuso/previsão é chamado nesta etapa.
- **Dependências:** T-01, T-07.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`
- **Tipo:** Data

### T-11 — Implementar seleção e resolução do fuso no hook
- **Descrição:** Estender o hook para seleção da cidade e resolução do fuso antes da consulta meteorológica.
- **Critérios de aceite:** Seleção grava a mesma `City`; status do fuso transita idle/loading/success/error; serviço de fuso recebe a operação; `getWeather` não é chamado antes do fuso bem-sucedido; falha mantém cidade e expõe estado de erro.
- **Dependências:** T-09, T-10.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`
- **Tipo:** Data

### T-12 — Implementar consulta meteorológica e unidade no hook
- **Descrição:** Estender o hook para previsão, estados parcial/erro, retry e unidade de apresentação.
- **Critérios de aceite:** Unidade inicial é `celsius`; sucesso completo/partial/erro produzem status distintos; erro/timeout preserva cidade para retry; abort por cancelamento não é classificado como timeout; alterar unidade não chama `getWeather` novamente.
- **Dependências:** T-08, T-11.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`
- **Tipo:** Data

## Entrega 4: Componentes

### T-13 — Criar o formulário de busca
- **Descrição:** Implementar entrada e envio por botão ou teclado, sem iniciar busca com texto vazio.
- **Critérios de aceite:** Campo tem nome acessível associado; submit por botão e Enter envia uma vez o nome com espaços externos removidos; acentos, apóstrofos, hífens e espaços internos são preservados; entrada vazia/só espaços não chama callback e apresenta mensagem em pt-BR.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/CitySearch.tsx`
- **Tipo:** UI

### T-14 — Criar a lista de resultados de localização
- **Descrição:** Exibir localidades encontradas e permitir selecionar uma cidade.
- **Critérios de aceite:** Para cada `City`, renderiza nome e valores não nulos de `admin1` e `country`; cada resultado é focalizável e selecionável por teclado; componente não renderiza dados meteorológicos.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/LocationResults.tsx`
- **Tipo:** UI

### T-15 — Exibir condições atuais
- **Descrição:** Criar componente para cidade, temperatura atual e condição meteorológica.
- **Critérios de aceite:** Renderiza nome da cidade, descrição retornada pelo mapper WMO e temperatura convertida conforme `unit`; `temperatureC` ou `weatherCode` nulos são identificados como indisponíveis, sem exibir zero ou valor substituto.
- **Dependências:** T-01, T-02, T-03.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`
- **Tipo:** UI

### T-16 — Exibir previsão de cinco dias
- **Descrição:** Criar componente para datas, mínimas, máximas e condições diárias.
- **Critérios de aceite:** Com cinco datas de entrada, renderiza cinco itens na mesma ordem; cada item mostra data, mínima, máxima e condição; temperaturas respeitam `unit`; valores nulos exibem indisponibilidade e não são substituídos.
- **Dependências:** T-01, T-02, T-03, T-04.
- **Arquivos prováveis:** `src/components/FiveDayForecast.tsx`
- **Tipo:** UI

### T-17 — Criar controle de unidade
- **Descrição:** Implementar alternância acessível entre Celsius e Fahrenheit.
- **Critérios de aceite:** Com `celsius` selecionado, Celsius aparece como ativo; teclado permite selecionar Celsius e Fahrenheit; seleção tem nome/estado acessível e invoca callback uma vez com `celsius` ou `fahrenheit`.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/TemperatureUnitToggle.tsx`
- **Tipo:** UI

### T-18 — Criar feedback de consulta
- **Descrição:** Implementar mensagens de carregamento, vazio, erro e retry para busca, fuso e clima.
- **Critérios de aceite:** Cada status suportado renderiza mensagem pt-BR; empty e error têm textos diferentes; loading usa região `status` e erro usa região `alert`; retry tem nome acessível e aciona apenas callback recebido; mensagens não contêm payload técnico.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/QueryFeedback.tsx`
- **Tipo:** UI

## Entrega 5: Integração da aplicação

### T-19 — Compor a tela principal
- **Descrição:** Conectar formulário, resultados, componentes meteorológicos, feedback e hook.
- **Critérios de aceite:** Busca válida exibe resultados; somente selecionar um resultado inicia o fluxo de clima; empty, error e partial são encaminhados aos componentes correspondentes; textos estáticos da tela estão em pt-BR.
- **Dependências:** T-12, T-13, T-14, T-15, T-16, T-17, T-18.
- **Arquivos prováveis:** `src/App.tsx`, `src/main.tsx`
- **Tipo:** UI

## Entrega 6: Testes

### T-20 — Configurar a infraestrutura do Vitest
- **Descrição:** Configurar ambiente de execução e dependências de teste unitário/componentes.
- **Critérios de aceite:** `package.json` declara Vitest, jsdom e Testing Library; `vite.config.ts` seleciona jsdom; `pnpm exec vitest --version` termina com código 0; nenhuma configuração E2E ou de componente é incluída.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `vite.config.ts`, `package.json`
- **Tipo:** Infra

### T-21 — Criar o setup compartilhado dos testes
- **Descrição:** Criar inicialização comum dos testes, incluindo matchers necessários para DOM.
- **Critérios de aceite:** `tests/setup.ts` está registrado em `setupFiles` e importa os matchers DOM para Vitest; a configuração resolvida do Vitest inclui esse arquivo; o setup não inicia chamadas de rede.
- **Dependências:** T-20.
- **Arquivos prováveis:** `tests/setup.ts`, `vite.config.ts`
- **Tipo:** Test

### T-22 — Testar conversões de temperatura
- **Descrição:** Cobrir conversões, valores ausentes e formatação.
- **Critérios de aceite:** Testes verificam `0 °C = 32 °F`, `32 °F = 0 °C`, `-40 °C = -40 °F`, `null` nas duas direções e que a formatação não altera o valor numérico canônico; não usam DOM, rede ou relógio real.
- **Dependências:** T-21, T-02.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`
- **Tipo:** Test

### T-23 — Testar descrições de códigos meteorológicos
- **Descrição:** Cobrir mapeamentos conhecidos e desconhecidos de códigos WMO.
- **Critérios de aceite:** Há pelo menos um teste para cada código declarado suportado e um para código desconhecido; resultados correspondem à tabela do módulo e não usam rede ou DOM.
- **Dependências:** T-21, T-03.
- **Arquivos prováveis:** `tests/unit/weatherCode.test.ts`
- **Tipo:** Test

### T-24 — Testar formatação de datas e fusos
- **Descrição:** Cobrir datas locais em diferentes fusos horários.
- **Critérios de aceite:** Para `2026-11-11T00:30:00Z`, testes confirmam 11 de novembro em `UTC` e 10 de novembro em `America/Los_Angeles`; teste de fuso inválido confirma `RangeError`; não usam relógio real ou rede.
- **Dependências:** T-21, T-04.
- **Arquivos prováveis:** `tests/unit/dateTime.test.ts`
- **Tipo:** Test

### T-25 — Testar o serviço de geocodificação
- **Descrição:** Validar requisição, normalização e falhas com `fetch` simulado.
- **Critérios de aceite:** Testes assertam endpoint e cada parâmetro, normalização de `admin1`/`country`, lista vazia, tipos de erro HTTP/rede/JSON e abort após 120 segundos com relógio simulado; nenhum teste chama a rede.
- **Dependências:** T-21, T-07.
- **Arquivos prováveis:** `tests/unit/geocodingService.test.ts`
- **Tipo:** Test

### T-26 — Testar o mapeador de previsão
- **Descrição:** Cobrir normalização de respostas meteorológicas completas, parciais e inválidas.
- **Critérios de aceite:** Fixtures verificam mapeamento completo, truncamento após cinco dias, alinhamento por índice, campo ausente como `null`, valor presente com tipo inválido, erro estrutural e `retrievedAt` ISO; relógio é fixado e não há rede.
- **Dependências:** T-21, T-05.
- **Arquivos prováveis:** `tests/unit/openMeteoMapper.test.ts`
- **Tipo:** Test

### T-27 — Testar o serviço de previsão
- **Descrição:** Validar requisição e falhas de transporte do serviço com `fetch` simulado.
- **Critérios de aceite:** Testes assertam cada parâmetro da URL, timezone codificado, sinal de abort em 120 segundos, HTTP não-2xx, rede, JSON inválido e exatamente uma chamada por invocação; nenhum teste acessa a API real.
- **Dependências:** T-21, T-08.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`
- **Tipo:** Test

### T-28 — Testar resolução do fuso
- **Descrição:** Testar autorização, negação, indisponibilidade, fallback e falha sem provedores reais.
- **Critérios de aceite:** Testes simulam sucesso da geolocalização, permissão negada, API indisponível, fallback bem-sucedido e falha final; verificam coordenadas/contagem de chamadas, timezone IANA ou erro esperado; nenhuma chamada externa real ocorre.
- **Dependências:** T-21, T-09.
- **Arquivos prováveis:** `tests/unit/timeZoneService.test.ts`
- **Tipo:** Test

### T-29 — Testar busca no hook
- **Descrição:** Cobrir submissão, estados de geocodificação e retry da busca.
- **Critérios de aceite:** Mocks verificam idle/loading/success/empty/error, query enviada após trim, zero chamadas para vazio, query preservada no erro e zero chamadas a `getWeather`/serviço de fuso.
- **Dependências:** T-21, T-10.
- **Arquivos prováveis:** `tests/unit/useWeatherApp.search.test.ts`
- **Tipo:** Test

### T-30 — Testar seleção e fuso no hook
- **Descrição:** Cobrir a transição da seleção para a resolução do fuso.
- **Critérios de aceite:** Mocks assertam cidade selecionada, estados loading/success/error do fuso, timezone encaminhado após sucesso, preservação da cidade após falha e zero chamada prematura a `getWeather`.
- **Dependências:** T-21, T-11.
- **Arquivos prováveis:** `tests/unit/useWeatherApp.timeZone.test.ts`
- **Tipo:** Test

### T-31 — Testar previsão, retry e unidade no hook
- **Descrição:** Cobrir sucesso, dados parciais, erros, timeout, retry e alternância de unidade.
- **Critérios de aceite:** Mocks cobrem success/partial/error, falha de timeout versus cancelamento, retry com a mesma cidade e unidade inicial Celsius; contagem de chamadas a `getWeather` não aumenta ao alternar unidade.
- **Dependências:** T-21, T-12.
- **Arquivos prováveis:** `tests/unit/useWeatherApp.weather.test.ts`
- **Tipo:** Test

### T-32 — Testar o formulário de busca
- **Descrição:** Cobrir submissão, validação e preservação da grafia no formulário.
- **Critérios de aceite:** Testes verificam callback com query aparada, ausência de callback para vazio/só espaços, preservação de `São João d'Ávila` e envio por Enter; testes passam sem serviços reais.
- **Dependências:** T-21, T-13.
- **Arquivos prováveis:** `tests/unit/CitySearch.test.tsx`
- **Tipo:** Test

### T-33 — Testar resultados e seleção de cidade
- **Descrição:** Cobrir metadados opcionais e seleção acessível de uma localidade.
- **Critérios de aceite:** Testes verificam nome, `admin1`/`country` presentes e nulos, seleção por teclado e callback com o objeto `City` correto; componente não contém nem renderiza previsão.
- **Dependências:** T-21, T-14.
- **Arquivos prováveis:** `tests/unit/LocationResults.test.tsx`
- **Tipo:** Test

### T-34 — Testar condições atuais
- **Descrição:** Cobrir apresentação das condições atuais completas e parciais.
- **Critérios de aceite:** Testes assertam nome e condição, valor numérico esperado em Celsius e Fahrenheit, rótulo de indisponibilidade para temperatura/código nulos e ausência de zero inventado.
- **Dependências:** T-21, T-15.
- **Arquivos prováveis:** `tests/unit/CurrentWeather.test.tsx`
- **Tipo:** Test

### T-35 — Testar previsão de cinco dias
- **Descrição:** Cobrir apresentação dos dias e dos campos meteorológicos disponíveis/indisponíveis.
- **Critérios de aceite:** Fixture de cinco dias resulta em cinco itens ordenados; testes assertam data, mínima/máxima, condição, valores convertidos para ambas as unidades e texto de indisponibilidade para cada campo nulo.
- **Dependências:** T-21, T-16.
- **Arquivos prováveis:** `tests/unit/FiveDayForecast.test.tsx`
- **Tipo:** Test

### T-36 — Testar controle de unidade
- **Descrição:** Cobrir estado inicial e seleção das duas unidades.
- **Critérios de aceite:** Testes assertam opção Celsius ativa inicialmente, navegação/seleção de cada opção por teclado, estado acessível atualizado e callback com o valor selecionado.
- **Dependências:** T-21, T-17.
- **Arquivos prováveis:** `tests/unit/TemperatureUnitToggle.test.tsx`
- **Tipo:** Test

### T-37 — Testar feedback de consulta
- **Descrição:** Cobrir estados visuais e ação de nova tentativa.
- **Critérios de aceite:** Um teste por status verifica conteúdo e role acessível; testes de empty/error confirmam mensagens diferentes; Enter/Space no controle de retry invoca callback uma vez; texto não inclui detalhes internos simulados.
- **Dependências:** T-21, T-18.
- **Arquivos prováveis:** `tests/unit/QueryFeedback.test.tsx`
- **Tipo:** Test

### T-38 — Testar composição da busca e seleção
- **Descrição:** Cobrir integração da tela para busca, resultados e seleção de cidade.
- **Critérios de aceite:** Com serviços controlados, testes assertam resultados após busca, mensagem empty, cidade enviada ao selecionar e ausência de chamada meteorológica antes da seleção.
- **Dependências:** T-21, T-19.
- **Arquivos prováveis:** `tests/unit/App.search.test.tsx`
- **Tipo:** Test

### T-39 — Testar composição da consulta meteorológica
- **Descrição:** Cobrir integração da tela para dados atuais, previsão, unidade e falhas.
- **Critérios de aceite:** Com serviços controlados, testes assertam clima atual, cinco itens diários, valores após alternância sem chamada adicional, campos indisponíveis em partial e retry para a cidade previamente selecionada.
- **Dependências:** T-21, T-19.
- **Arquivos prováveis:** `tests/unit/App.weather.test.tsx`
- **Tipo:** Test

## Entrega 7: Hardening

### T-40 — Testar o fluxo E2E principal em viewport mobile
- **Descrição:** Validar a jornada busca → seleção → clima atual e previsão em viewport mobile com APIs interceptadas.
- **Critérios de aceite:** Em viewport de 320 px, Playwright intercepta geocodificação e forecast e verifica busca, seleção, clima atual e exatamente cinco dias; forecast não é chamado antes da seleção; `document.documentElement.scrollWidth <= window.innerWidth`; nenhuma requisição sai para hosts reais.
- **Dependências:** T-19.
- **Arquivos prováveis:** `tests/e2e/search.spec.ts`
- **Tipo:** Test

### T-41 — Testar jornadas E2E meteorológicas
- **Descrição:** Validar previsão, troca de unidade, resposta parcial, erro e retry com APIs interceptadas.
- **Critérios de aceite:** Playwright intercepta forecast e verifica condições atuais e cinco dias; alternância de unidade mantém o contador de requests; fixtures partial mostram campos indisponíveis; após falha, retry repete a consulta com as mesmas coordenadas da cidade; nenhum host real é acessado.
- **Dependências:** T-27, T-31, T-34, T-35, T-36, T-37, T-39, T-40.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`
- **Tipo:** Test

### T-42 — Testar fuso e responsividade em E2E
- **Descrição:** Verificar fluxo de fuso aprovado e layout em viewport desktop.
- **Critérios de aceite:** Rotas simuladas verificam fuso por geolocalização e fallback aprovado; em viewport desktop de 1920 px, `document.documentElement.scrollWidth <= window.innerWidth`; nenhuma requisição é enviada a serviços reais.
- **Dependências:** T-06, T-09, T-19, T-28, T-40.
- **Arquivos prováveis:** `tests/e2e/timeZone-responsive.spec.ts`
- **Tipo:** Test

### T-43 — Executar os gates de qualidade
- **Descrição:** Executar lint, build, testes unitários e E2E, registrando resultados sem absorver correções de tarefas anteriores.
- **Critérios de aceite:** `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e` terminam com código 0; resultados e falhas encaminhadas à tarefa responsável ficam registrados no relatório da entrega; esta tarefa não altera arquivos de implementação.
- **Dependências:** T-22, T-23, T-24, T-25, T-26, T-27, T-28, T-29, T-30, T-31, T-32, T-33, T-34, T-35, T-36, T-37, T-38, T-39, T-40, T-41, T-42.
- **Arquivos prováveis:** Nenhum arquivo específico; comandos do projeto.
- **Tipo:** Infra

## Rastreabilidade

| Tarefa | Requisitos da spec |
| --- | --- |
| T-01 | RF-01 a RF-09 (modelo compartilhado) |
| T-02 | RF-05, RF-06; CA-05, CA-06 |
| T-03 | RF-03, RF-04, RF-08 |
| T-04 | RF-04, RF-09; CA-04, CA-09 |
| T-05 | RF-03, RF-04, RF-08, RF-09; CA-03, CA-04, CA-08, CA-09 |
| T-06 | RF-09; CA-09 (decisão de produto/privacidade) |
| T-07 | RF-01, RF-02, RF-07; CA-01, CA-02, CA-07 |
| T-08 | RF-03, RF-04, RF-07, RF-08, RF-09; CA-03, CA-04, CA-07, CA-08, CA-09 |
| T-09 | RF-09; CA-09 |
| T-10 | RF-01, RF-07; CA-01, CA-07 |
| T-11 | RF-02, RF-07, RF-09; CA-02, CA-07, CA-09 |
| T-12 | RF-03 a RF-08; CA-03 a CA-08, RNF-06 |
| T-13 | RF-01; CA-01, RNF-03, RNF-07 |
| T-14 | RF-02; CA-02, RNF-03 |
| T-15 | RF-03, RF-06, RF-08; CA-03, CA-06, CA-08, RNF-03, RNF-07 |
| T-16 | RF-04, RF-06, RF-08; CA-04, CA-06, CA-08, RNF-01, RNF-03 |
| T-17 | RF-05, RF-06; CA-05, CA-06, RNF-03 |
| T-18 | RF-07; CA-07, RNF-03, RNF-07 |
| T-19 | RF-01 a RF-09; CA-01 a CA-09, RNF-01, RNF-03, RNF-07 |
| T-20 | Infraestrutura de teste; sem RF direto |
| T-21 | Infraestrutura de teste; suporte transversal a RNF-03 |
| T-22 | RF-05, RF-06; CA-05, CA-06 |
| T-23 | RF-03, RF-04, RF-08 |
| T-24 | RF-04, RF-09; CA-04, CA-09 |
| T-25 | RF-01, RF-02, RF-07; CA-01, CA-02, CA-07 |
| T-26 | RF-03, RF-04, RF-08, RF-09; CA-03, CA-04, CA-08, CA-09 |
| T-27 | RF-03, RF-04, RF-07, RF-08, RF-09; CA-03, CA-04, CA-07, CA-08, CA-09 |
| T-28 | RF-09; CA-09 |
| T-29 | RF-01, RF-07; CA-01, CA-07 |
| T-30 | RF-02, RF-07, RF-09; CA-02, CA-07, CA-09 |
| T-31 | RF-03 a RF-08; CA-03 a CA-08, RNF-06 |
| T-32 | RF-01; CA-01 |
| T-33 | RF-02; CA-02 |
| T-34 | RF-03, RF-06, RF-08; CA-03, CA-06, CA-08 |
| T-35 | RF-04, RF-06, RF-08; CA-04, CA-06, CA-08 |
| T-36 | RF-05, RF-06; CA-05, CA-06 |
| T-37 | RF-07; CA-07 |
| T-38 | RF-01, RF-02, RF-07; CA-01, CA-02, CA-07 |
| T-39 | RF-03 a RF-08; CA-03 a CA-08 |
| T-40 | RF-01, RF-02, RF-03, RF-04; CA-01, CA-02, CA-03, CA-04, RNF-01 |
| T-41 | RF-03 a RF-08; CA-03 a CA-08, RNF-06 |
| T-42 | RF-09; CA-09, RNF-01, RNF-03 |
| T-43 | Validação transversal; RNF-01, RNF-03, RNF-06, RNF-07 |