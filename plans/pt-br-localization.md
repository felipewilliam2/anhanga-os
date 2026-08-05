# Localização para pt-BR (Anhangá Viagens)

**Objetivo:** traduzir todo o texto visível da interface (`packages/workshop-frontend`) para português do Brasil, fixo — sem biblioteca de i18n, sem seletor de idioma. Uso interno da Anhangá Viagens; não há necessidade de suportar múltiplos idiomas.

**Fora de escopo (decidido em 2026-08-05, ver `MEMORY.md`/histórico da conversa se quiser revisitar):**
- Mensagens de erro lançadas pelo backend (`packages/workshop-backend/src`, ~250 `throw new Error(...)`). Elas chegam ao usuário como toasts, mas mudar isso exige trocar de "string solta" para um esquema de código de erro traduzível — mudança arquitetural maior, tratada como uma fase futura separada se for necessária.
- Templates de e-mail (`packages/gatekeeper-email`).
- Conteúdo gerado dinamicamente por blueprints/gadgets (esses são "aplicativos" que o próprio usuário ou a IA cria dentro da plataforma — não fazem parte do "chrome" do produto).
- Nomes de identificadores no código (variáveis, componentes, props, classes CSS, nomes de arquivo) — só o texto voltado ao usuário muda.

## Por que este plano não segue o formato TDD linha a linha

Isto é um trabalho de conteúdo (tradução), não de lógica nova. Não existe "teste que falha" natural para uma string traduzida — a verificação real é (a) uma varredura heurística por texto em inglês remanescente e (b) conferência visual no navegador. Cada tarefa abaixo troca o ciclo RED/GREEN por: **traduzir → rodar o script de verificação → checar visualmente no app → commit**.

## Ferramenta de apoio (já criada)

`scripts/check-pt-br-strings.mjs` — varre arquivos `.tsx`/`.ts` e sinaliza texto de JSX e atributos (`placeholder`, `title`, `aria-label`, `alt`, `label`) que parecem estar em inglês. É uma heurística (falsos positivos/negativos esperados), não um gate de CI. Uso:

```bash
node scripts/check-pt-br-strings.mjs packages/workshop-frontend/src/LoginPage.tsx
node scripts/check-pt-br-strings.mjs packages/workshop-frontend/src/components/AppShell
```

Rode antes e depois de traduzir cada arquivo/grupo — o "antes" ajuda a não esquecer strings, o "depois" confirma que não sobrou nada óbvio.

## Glossário de termos (usar de forma consistente em todo o app)

Termos de produto sem tradução óbvia — decisão tomada agora para não haver inconsistência entre telas traduzidas por passes diferentes:

| Termo original | Tradução adotada | Observação |
|---|---|---|
| Workspace | Espaço de trabalho | |
| Gadget | Gadget | Mantido — termo de produto, como "app"; "aplicativo" é aceitável como alternativa pontual quando "Gadget" já apareceu na mesma frase |
| Blueprint | Template | Revisado na Tarefa 3: "Modelo" colidia com "modelo de IA" (AI model), já em uso desde a Tarefa 2. "Template" é empréstimo comum no português técnico brasileiro e evita a ambiguidade. |
| Model (AI) | Modelo | Só para modelo de IA (ex.: "Escolha seu modelo", seletor de modelo). Nunca usar "Modelo" para Blueprint — ver linha acima. |
| Gatekeeper | Guardião | |
| Connection / Connector | Conexão / Conector | |
| Vendor | Provedor | Ex.: "Provedores conectados" |
| Output | Saída | |
| Format | Formato | |
| Onboarding | Configuração inicial | |
| Admin / Administrator | Administrador / Administração | |
| Account | Conta | |
| Sign in / Log in | Entrar | |
| Sign up | Criar conta | |
| Home | Início | |
| Explore | Explorar | |
| Profile | Perfil | |
| Settings | Configurações | |
| Activity | Atividade | |
| Share | Compartilhar | |
| Hook | Hook | Mantido — termo técnico do domínio (automação) |
| Capsule | Cápsula | |
| Deployment | Implantação | Adicionado na Tarefa 2 (aparece de novo em Admin/Settings) |
| Login (substantivo) | Login | Mantido como empréstimo consagrado no português brasileiro (ex.: "O login foi cancelado."); o verbo "sign in" continua "Entrar" |
| Binding | Vinculação | Adicionado na Tarefa 6 (Conexões/Guardiões). Refere-se ao vínculo entre um gadget e um recurso/conexão externa (ex.: "Nome da vinculação", "A vinculação X será removida"). |
| Configurator | Configurador | Adicionado na Tarefa 6 — tradução literal direta, sem ambiguidade com outros termos do glossário. |

Se aparecer um termo novo durante a tradução que não está nesta tabela, pare e adicione a decisão aqui antes de seguir — não improvise traduções diferentes para o mesmo termo em arquivos diferentes.

## Convenção de trabalho para cada tarefa

1. Abrir cada arquivo listado na tarefa.
2. Traduzir todo texto voltado ao usuário: texto JSX visível, `placeholder`, `title`, `aria-label`, `alt`, mensagens de `toasts.add({...})`, texto de validação, estados vazios, tooltips.
3. Usar o glossário acima para termos de produto. Manter a ortografia completa do português (acentos, "ç", etc.).
4. Rodar `node scripts/check-pt-br-strings.mjs <arquivos da tarefa>` e revisar cada linha sinalizada.
5. Subir o app local (`pnpm run-local` ou `pnpm dev-server` + `pnpm dev-client`) e passar pela tela/fluxo correspondente visualmente — checar que nenhum texto ficou cortado ou quebrado por strings mais longas em português.
6. Commit por tarefa (grupo de arquivos), não por string individual — commits menores que isso viram ruído.

---

## Tarefa 1 — Infraestrutura (feito nesta sessão)

- [x] Criar `scripts/check-pt-br-strings.mjs`
- [x] Definir o glossário de termos acima

## Tarefa 2 — Autenticação e configuração inicial

Telas de maior visibilidade (primeira coisa que qualquer usuário vê) e menor risco — bom ponto de partida.

**Arquivos:**
- `packages/workshop-frontend/src/LoginPage.tsx`
- `packages/workshop-frontend/src/SignupPage.tsx`
- `packages/workshop-frontend/src/OnboardingWizard.tsx`
- `packages/workshop-frontend/src/AuthContext.tsx`
- `packages/workshop-frontend/src/ProtectedRoute.tsx`
- `packages/workshop-frontend/src/components/auth/CloudflareLogo.tsx`
- `packages/workshop-frontend/src/components/auth/OAuthButtons.tsx`
- `packages/workshop-frontend/src/routes/signup.tsx`

- [ ] Traduzir os arquivos acima seguindo a convenção de trabalho
- [ ] `node scripts/check-pt-br-strings.mjs packages/workshop-frontend/src/LoginPage.tsx packages/workshop-frontend/src/SignupPage.tsx packages/workshop-frontend/src/OnboardingWizard.tsx packages/workshop-frontend/src/AuthContext.tsx packages/workshop-frontend/src/ProtectedRoute.tsx packages/workshop-frontend/src/components/auth packages/workshop-frontend/src/routes/signup.tsx`
- [ ] Conferir visualmente: tela de login, criar conta, wizard de configuração inicial completo (as 4 etapas)
- [ ] Commit: `git commit -m "i18n: traduzir telas de autenticação e configuração inicial para pt-BR"`

## Tarefa 3 — Navegação principal (AppShell)

O "chrome" que aparece em toda tela autenticada.

**Arquivos:**
- `packages/workshop-frontend/src/components/AppShell/AppShell.tsx`
- `packages/workshop-frontend/src/components/AppShell/CommandPalette.tsx`
- `packages/workshop-frontend/src/components/AppShell/HomeTaskSuggestions.tsx`
- `packages/workshop-frontend/src/components/AppShell/Sidebar.tsx`
- `packages/workshop-frontend/src/components/AppShell/SidebarGadgetRow.tsx`
- `packages/workshop-frontend/src/components/AppShell/SidebarItem.tsx`
- `packages/workshop-frontend/src/components/AppShell/SidebarUtilityStrip.tsx`
- `packages/workshop-frontend/src/components/AppShell/SidebarWorkspaces.tsx`
- `packages/workshop-frontend/src/components/Header.tsx`
- `packages/workshop-frontend/src/components/UserMenu.tsx`
- `packages/workshop-frontend/src/components/AnnouncementBanner.tsx`
- `packages/workshop-frontend/src/TopBarNotice.tsx`
- `packages/workshop-frontend/src/components/SiteLogo.tsx`
- `packages/workshop-frontend/src/FrontendErrorBoundary.tsx`
- `packages/workshop-frontend/src/routes/__root.tsx` (estados de "Loading...", "Connection lost — reconnecting…", "Authentication error", botão "Retry" — renderizados para qualquer usuário autenticado; inclui também `"Authenticating..."` sinalizado pela Tarefa 2 como fora do escopo dela)
- `packages/workshop-frontend/index.html` (atributo `lang="en"` no `<html>` — achado pela Tarefa 2: com o app já em pt-BR, isso faz o tradutor automático do Chrome tentar "traduzir de volta" o app para usuários reais; trocar para `lang="pt-BR"`)

- [ ] Traduzir os arquivos acima
- [ ] `node scripts/check-pt-br-strings.mjs packages/workshop-frontend/src/components/AppShell packages/workshop-frontend/src/components/Header.tsx packages/workshop-frontend/src/components/UserMenu.tsx packages/workshop-frontend/src/components/AnnouncementBanner.tsx packages/workshop-frontend/src/TopBarNotice.tsx packages/workshop-frontend/src/components/SiteLogo.tsx packages/workshop-frontend/src/FrontendErrorBoundary.tsx packages/workshop-frontend/src/routes/__root.tsx`
- [ ] Conferir visualmente: sidebar, command palette (atalho de busca), menu de usuário
- [ ] Commit: `git commit -m "i18n: traduzir navegação principal (AppShell) para pt-BR"`

## Tarefa 4 — Início, espaços de trabalho e listas

**Arquivos:**
- `packages/workshop-frontend/src/routes/index.tsx`
- `packages/workshop-frontend/src/routes/workspaces.tsx`
- `packages/workshop-frontend/src/routes/workspace.$id.tsx`
- `packages/workshop-frontend/src/routes/gadget.$id.tsx`
- `packages/workshop-frontend/src/WorkpiecePicker.tsx`
- `packages/workshop-frontend/src/components/RecentApps.tsx`
- `packages/workshop-frontend/src/components/GadgetList.tsx`
- `packages/workshop-frontend/src/components/EmptyState.tsx`
- `packages/workshop-frontend/src/components/CountBadge.tsx`
- `packages/workshop-frontend/src/components/ViewToggle.tsx`
- `packages/workshop-frontend/src/components/TabButton.tsx`
- `packages/workshop-frontend/src/components/SectionEyebrow.tsx`
- `packages/workshop-frontend/src/ShareModal.tsx`
- `packages/workshop-frontend/src/components/WorkspaceOpenErrorPage.tsx`

- [ ] Traduzir os arquivos acima
- [ ] `node scripts/check-pt-br-strings.mjs packages/workshop-frontend/src/routes/index.tsx packages/workshop-frontend/src/routes/workspaces.tsx packages/workshop-frontend/src/routes/workspace.\$id.tsx packages/workshop-frontend/src/routes/gadget.\$id.tsx packages/workshop-frontend/src/WorkpiecePicker.tsx packages/workshop-frontend/src/components/RecentApps.tsx packages/workshop-frontend/src/components/GadgetList.tsx packages/workshop-frontend/src/components/EmptyState.tsx packages/workshop-frontend/src/components/CountBadge.tsx packages/workshop-frontend/src/components/ViewToggle.tsx packages/workshop-frontend/src/components/TabButton.tsx packages/workshop-frontend/src/components/SectionEyebrow.tsx packages/workshop-frontend/src/ShareModal.tsx packages/workshop-frontend/src/components/WorkspaceOpenErrorPage.tsx`
- [ ] Conferir visualmente: tela inicial ("O que vamos fazer hoje?"), lista de espaços de trabalho, modal de compartilhamento
- [ ] Commit: `git commit -m "i18n: traduzir início e listagem de espaços de trabalho para pt-BR"`

## Tarefa 5 — Administração e perfil

Já parcialmente conhecido desta sessão (nome do site, logo, tema).

**Arquivos:**
- `packages/workshop-frontend/src/AdminPage.tsx`
- `packages/workshop-frontend/src/SettingsPage.tsx`
- `packages/workshop-frontend/src/routes/admin.tsx`
- `packages/workshop-frontend/src/routes/profile.tsx`
- `packages/workshop-frontend/src/components/billing/AccountSelectionModal.tsx`
- `packages/workshop-frontend/src/components/billing/OutOfCreditsModal.tsx`
- `packages/workshop-frontend/src/components/billing/ResetCountdown.tsx`
- `packages/workshop-frontend/src/components/billing/UsageSettings.tsx`
- `packages/workshop-frontend/src/components/format/AdminFormatsPanel.tsx`
- `packages/workshop-frontend/src/components/format/ComposerFormatMenuItems.tsx`
- `packages/workshop-frontend/src/components/format/FormatVisuals.tsx`
- `packages/workshop-frontend/src/components/format/NewFormatRow.tsx`

- [ ] Traduzir os arquivos acima
- [ ] `node scripts/check-pt-br-strings.mjs packages/workshop-frontend/src/AdminPage.tsx packages/workshop-frontend/src/SettingsPage.tsx packages/workshop-frontend/src/routes/admin.tsx packages/workshop-frontend/src/routes/profile.tsx packages/workshop-frontend/src/components/billing packages/workshop-frontend/src/components/format`
- [ ] Conferir visualmente: todas as abas do Admin (Em geral, Guardiões, Formatos, Acesso), página de perfil
- [ ] Commit: `git commit -m "i18n: traduzir administração e perfil para pt-BR"`

## Tarefa 6 — Conexões e Guardiões (Gatekeepers)

**Arquivos:**
- `packages/workshop-frontend/src/Connections.tsx`
- `packages/workshop-frontend/src/ConnectAccountModal.tsx`
- `packages/workshop-frontend/src/components/ConnectConnectorModal.tsx`
- `packages/workshop-frontend/src/GatekeeperModal.tsx`
- `packages/workshop-frontend/src/GatekeeperAppPage.tsx`
- `packages/workshop-frontend/src/VendorCard.tsx`
- `packages/workshop-frontend/src/ResourcePicker.tsx`
- `packages/workshop-frontend/src/ResourceConfiguratorHost.tsx`
- `packages/workshop-frontend/src/SandboxedGatekeeperApp.tsx`
- `packages/workshop-frontend/src/SandboxedResourceConfigurator.tsx`
- `packages/workshop-frontend/src/components/ConnectionChips.tsx`
- `packages/workshop-frontend/src/components/ConnectionLogos.tsx`
- `packages/workshop-frontend/src/components/GatekeeperIcon.tsx`
- `packages/workshop-frontend/src/components/pickerRows.tsx`
- `packages/workshop-frontend/src/routes/gatekeepers.tsx`
- `packages/workshop-frontend/src/routes/gatekeepers_.$appId.tsx`
- `packages/workshop-frontend/src/routes/providers.tsx`
- `packages/workshop-frontend/src/routes/context.tsx`
- `packages/workshop-frontend/src/AddModelModal.tsx`
- `packages/workshop-frontend/src/gatekeeper-modal/AccountChooser.tsx`
- `packages/workshop-frontend/src/gatekeeper-modal/AgentSpawnerConfigForm.tsx`
- `packages/workshop-frontend/src/gatekeeper-modal/AiModelConnectionConfig.tsx`
- `packages/workshop-frontend/src/gatekeeper-modal/ConnectionConfigField.tsx`

- [ ] Traduzir os arquivos acima
- [ ] `node scripts/check-pt-br-strings.mjs packages/workshop-frontend/src/Connections.tsx packages/workshop-frontend/src/ConnectAccountModal.tsx packages/workshop-frontend/src/GatekeeperModal.tsx packages/workshop-frontend/src/GatekeeperAppPage.tsx packages/workshop-frontend/src/VendorCard.tsx packages/workshop-frontend/src/ResourcePicker.tsx packages/workshop-frontend/src/ResourceConfiguratorHost.tsx packages/workshop-frontend/src/SandboxedGatekeeperApp.tsx packages/workshop-frontend/src/SandboxedResourceConfigurator.tsx packages/workshop-frontend/src/AddModelModal.tsx packages/workshop-frontend/src/gatekeeper-modal packages/workshop-frontend/src/routes/gatekeepers.tsx "packages/workshop-frontend/src/routes/gatekeepers_.\$appId.tsx" packages/workshop-frontend/src/routes/providers.tsx packages/workshop-frontend/src/routes/context.tsx`
- [ ] Conferir visualmente: página de conexões, conectar um provedor (ex.: e-mail ou Google em modo de teste), seletor de modelo de IA
- [ ] Commit: `git commit -m "i18n: traduzir conexões e guardiões para pt-BR"`

## Tarefa 7 — Templates (Blueprints)

**Arquivos:**
- `packages/workshop-frontend/src/BlueprintsPage.tsx`
- `packages/workshop-frontend/src/BlueprintLandingPage.tsx`
- `packages/workshop-frontend/src/BlueprintModal.tsx`
- `packages/workshop-frontend/src/components/BlueprintBindingCard.tsx`
- `packages/workshop-frontend/src/components/BlueprintCard.tsx`
- `packages/workshop-frontend/src/components/BlueprintList.tsx`
- `packages/workshop-frontend/src/components/BlueprintPreviewImage.tsx`
- `packages/workshop-frontend/src/routes/blueprint.$id.tsx`
- `packages/workshop-frontend/src/routes/blueprints.tsx`
- `packages/workshop-frontend/src/routes/outputs.tsx`
- `packages/workshop-frontend/src/GadgetExportMenu.tsx`

- [ ] Traduzir os arquivos acima
- [ ] `node scripts/check-pt-br-strings.mjs packages/workshop-frontend/src/BlueprintsPage.tsx packages/workshop-frontend/src/BlueprintLandingPage.tsx packages/workshop-frontend/src/BlueprintModal.tsx packages/workshop-frontend/src/components/BlueprintBindingCard.tsx packages/workshop-frontend/src/components/BlueprintCard.tsx packages/workshop-frontend/src/components/BlueprintList.tsx packages/workshop-frontend/src/components/BlueprintPreviewImage.tsx "packages/workshop-frontend/src/routes/blueprint.\$id.tsx" packages/workshop-frontend/src/routes/blueprints.tsx packages/workshop-frontend/src/routes/outputs.tsx packages/workshop-frontend/src/GadgetExportMenu.tsx`
- [ ] Conferir visualmente: página de templates, página de saídas, exportar um gadget
- [ ] Commit: `git commit -m "i18n: traduzir templates (blueprints) para pt-BR"`

## Tarefa 8 — Editor de espaço de trabalho e chat (maior superfície — fazer por último entre as principais)

**Arquivos:**
- `packages/workshop-frontend/src/ChatInterface.tsx`
- `packages/workshop-frontend/src/GadgetEditor.tsx`
- `packages/workshop-frontend/src/GadgetCodeInterface.tsx`
- `packages/workshop-frontend/src/GadgetUI.tsx`
- `packages/workshop-frontend/src/GadgetUseView.tsx`
- `packages/workshop-frontend/src/CodeEditor.tsx`
- `packages/workshop-frontend/src/CodeDiffEditor.tsx`
- `packages/workshop-frontend/src/FileSidebar.tsx`
- `packages/workshop-frontend/src/CapsuleOverlay.tsx`
- `packages/workshop-frontend/src/ObserverConfigModal.tsx`
- `packages/workshop-frontend/src/components/chat/AppPreview.tsx`
- `packages/workshop-frontend/src/components/chat/ChatMessage.tsx`
- `packages/workshop-frontend/src/components/chat/ComposerMirror.tsx`
- `packages/workshop-frontend/src/components/chat/ConnectionConfigModal.tsx`
- `packages/workshop-frontend/src/components/chat/DataTab.tsx`
- `packages/workshop-frontend/src/components/chat/PermissionToast.tsx`
- `packages/workshop-frontend/src/components/chat/SlashCommandPicker.tsx`
- `packages/workshop-frontend/src/components/chat/ToolCallCard.tsx`
- `packages/workshop-frontend/src/components/AutoApproveConfirmDialog.tsx`
- `packages/workshop-frontend/src/components/DeleteConfirmationDialog.tsx`
- `packages/workshop-frontend/src/components/HookToggle.tsx`
- `packages/workshop-frontend/src/components/ResolveButton.tsx`
- `packages/workshop-frontend/src/components/WorkshopControls.tsx`
- `packages/workshop-frontend/src/data/chat.ts` (conteúdo de amostra usado pelos componentes de chat acima — checar antes de traduzir se aparece de fato na UI de produção ou só em preview/demo interno)

- [ ] Traduzir os arquivos acima (o maior grupo — considerar dividir em 2 sessões: editor de código vs. chat)
- [ ] `node scripts/check-pt-br-strings.mjs packages/workshop-frontend/src/ChatInterface.tsx packages/workshop-frontend/src/GadgetEditor.tsx packages/workshop-frontend/src/GadgetCodeInterface.tsx packages/workshop-frontend/src/GadgetUI.tsx packages/workshop-frontend/src/GadgetUseView.tsx packages/workshop-frontend/src/CodeEditor.tsx packages/workshop-frontend/src/CodeDiffEditor.tsx packages/workshop-frontend/src/FileSidebar.tsx packages/workshop-frontend/src/CapsuleOverlay.tsx packages/workshop-frontend/src/ObserverConfigModal.tsx packages/workshop-frontend/src/components/chat packages/workshop-frontend/src/components/AutoApproveConfirmDialog.tsx packages/workshop-frontend/src/components/DeleteConfirmationDialog.tsx packages/workshop-frontend/src/components/HookToggle.tsx packages/workshop-frontend/src/components/ResolveButton.tsx packages/workshop-frontend/src/components/WorkshopControls.tsx`
- [ ] Conferir visualmente: abrir um gadget existente, conversar com o agente, revisar um diff de código proposto, aprovar/negar uma ação
- [ ] Commit: `git commit -m "i18n: traduzir editor de espaço de trabalho e chat para pt-BR"`

## Tarefa 9 — Atividade, avatares e componentes restantes

**Arquivos:**
- `packages/workshop-frontend/src/Activity.tsx`
- `packages/workshop-frontend/src/ActivityNotifications.tsx`
- `packages/workshop-frontend/src/components/GadgetPresence.tsx`
- `packages/workshop-frontend/src/components/Avatar.tsx`
- `packages/workshop-frontend/src/components/PersonAvatar.tsx`
- `packages/workshop-frontend/src/components/MeshBackground.tsx`
- `packages/workshop-frontend/src/components/ComingSoonPreview.tsx`
- `packages/workshop-frontend/src/App.tsx`
- `packages/workshop-frontend/src/routes/explore.tsx`

- [ ] Traduzir os arquivos acima
- [ ] `node scripts/check-pt-br-strings.mjs packages/workshop-frontend/src/Activity.tsx packages/workshop-frontend/src/ActivityNotifications.tsx packages/workshop-frontend/src/components/GadgetPresence.tsx packages/workshop-frontend/src/components/Avatar.tsx packages/workshop-frontend/src/components/PersonAvatar.tsx packages/workshop-frontend/src/components/MeshBackground.tsx packages/workshop-frontend/src/components/ComingSoonPreview.tsx packages/workshop-frontend/src/App.tsx packages/workshop-frontend/src/routes/explore.tsx`
- [ ] Conferir visualmente: painel de atividade/notificações, página "Explorar"
- [ ] Commit: `git commit -m "i18n: traduzir atividade e componentes restantes para pt-BR"`

## Tarefa 10 — Varredura final e checagem cruzada

- [ ] Rodar a varredura completa: `node scripts/check-pt-br-strings.mjs packages/workshop-frontend/src` e revisar toda a lista — nesse ponto deve sobrar muito pouco (textos curtos que o heurístico não pega, código de terceiros, etc.)
- [ ] Rodar `pnpm --filter @gadgets/workshop-frontend test` — nenhuma mudança de texto deve quebrar teste (se algum teste comparar strings literais em inglês, atualizar o teste junto)
- [ ] Passar pelo app inteiro uma vez, ponta a ponta, como um usuário novo: criar conta → configuração inicial → criar um espaço de trabalho → conversar com o agente → conectar um provedor → abrir Admin → sair
- [ ] Atenção especial à página de Admin (Tarefa 5): a verificação visual interativa dela não pôde ser feita durante a implementação nem durante a revisão (ferramenta de browser indisponível nas duas ocasiões) — conferir com cuidado as 4 abas (Em geral, Guardiões, Formatos, Acesso) e a página de Perfil por texto cortado/quebrado com strings mais longas em português
- [ ] Conferir consistência do glossário: buscar por termos que possam ter sido traduzidos de forma diferente em arquivos diferentes (ex.: `grep -rn "Área de trabalho\|Espaço de trabalho" packages/workshop-frontend/src` — só deve aparecer uma forma)
- [ ] Commit final se sobrar algo: `git commit -m "i18n: ajustes finais de consistência pt-BR"`

---

## Arquivos deliberadamente fora da lista (sem texto de usuário)

Contexts/infra puros — sem JSX renderizado, só lógica de estado/conexão. Conferido por leitura rápida; se algum ganhar texto de usuário no futuro, entra na tarefa mais próxima por assunto:

- `packages/workshop-frontend/src/FeatureFlagsContext.tsx`
- `packages/workshop-frontend/src/RpcContext.tsx`
- `packages/workshop-frontend/src/ServerConfigContext.tsx`
- `packages/workshop-frontend/src/ThemeContext.tsx`
- `packages/workshop-frontend/src/main.tsx`
- `packages/workshop-frontend/src/router.tsx`

## Fases futuras (fora deste plano)

- **Mensagens de erro do backend:** exigiria um esquema de código de erro (`throw new AppError('LOGO_TOO_LARGE')` + mapa de mensagens no frontend) em vez de string solta — mudança estrutural, não cosmética.
- **Templates de e-mail** (`packages/gatekeeper-email`).
- **Se decidirem suportar múltiplos idiomas no futuro:** nesse ponto valeria introduzir `react-i18next` de verdade em vez de string fixa — mas isso significa refazer o trabalho deste plano no formato `t('key')`. Vale decidir isso *antes* de começar, se houver qualquer chance de precisar de multi-idioma em menos de ~1 ano; senão, string fixa é o caminho mais rápido e simples agora.

## Auto-revisão deste plano

- **Cobertura:** todo arquivo `.tsx` de `packages/workshop-frontend/src` (exceto `.test.tsx`) aparece em exatamente uma tarefa (2–9) — conferido por listagem de diretório real, não por suposição.
- **Sem placeholders:** cada tarefa tem lista de arquivos real, comando de verificação real e executável, e critério de conferência visual concreto (tela/fluxo nomeado).
- **Consistência:** o glossário da Tarefa 1 é referenciado por todas as tarefas seguintes; qualquer termo novo deve ser adicionado lá antes de seguir, evitando duas traduções diferentes para o mesmo termo.
