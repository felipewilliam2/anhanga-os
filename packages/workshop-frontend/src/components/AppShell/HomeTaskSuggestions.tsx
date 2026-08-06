import { useMemo } from 'react'
import {
  AppWindow,
  ChartLineUp,
  FileText,
  Lightning,
  Presentation,
  type Icon,
} from '@phosphor-icons/react'

// A few example work tasks shown under the Home composer, so a new user immediately sees the kind
// of thing they can ask for. Picking one drops a starter prompt into the composer (it does not
// auto-send) so the user can tweak it before running.
type TaskSuggestion = {
  id: string
  label: string
  description: string
  prompt: string
  icon: Icon
}

// Formats are advertised by example rather than by a row of "Start with Docs" buttons, so the
// first move isn't "pick a file type". The formats themselves are in the composer's `+` menu.
const SUGGESTIONS: TaskSuggestion[] = [
  {
    id: 'one-on-one',
    label: 'Escrever preparação para um 1:1',
    description: 'Um documento com uma visão geral, pontos a analisar e um pedido',
    icon: FileText,
    prompt:
      'Crie um documento para preparar meu próximo 1:1 com um liderado: uma visão geral atual, um roteiro de coaching, pontos a analisar, pendências da última conversa e um pedido claro.',
  },
  {
    id: 'team-meeting',
    label: 'Montar uma apresentação para reunião de equipe',
    description: 'Slides com o progresso, riscos e o que precisa de decisão',
    icon: Presentation,
    prompt:
      'Crie uma apresentação de slides para minha próxima reunião de equipe: como estão as coisas, o que foi entregue, riscos e bloqueios, e as decisões que preciso do grupo. Pergunte primeiro no que a equipe está trabalhando.',
  },
  {
    id: 'insights',
    label: 'Encontrar insights nos meus dados',
    description: 'Transforme uma planilha ou CSV em tendências e recomendações',
    icon: ChartLineUp,
    prompt:
      'Transforme um conjunto de dados que vou compartilhar (uma planilha, CSV ou tabela colada) em uma análise narrativa: principais tendências, anomalias, o "e daí" e recomendações concretas.',
  },
  {
    id: 'workflow',
    label: 'Automatizar um fluxo de trabalho',
    description: 'Acionar um agente quando um novo e-mail chegar',
    icon: Lightning,
    prompt:
      'Crie um fluxo de trabalho de agente que roda automaticamente quando um novo e-mail chegar: ler a mensagem, decidir o que fazer e agir ou redigir uma resposta. Pergunte qual caixa de entrada monitorar e o que ele deve tratar.',
  },
  {
    id: 'app',
    label: 'Criar uma ferramenta rápida',
    description: 'Um pequeno aplicativo interativo, calculadora ou painel',
    icon: AppWindow,
    prompt:
      'Crie uma pequena ferramenta interativa que eu possa usar aqui mesmo — uma calculadora, painel ou explorador. Pergunte o que ela deve fazer e depois crie.',
  },
]

// One row, shared by every suggestion so the list reads as one kind of offer.
function SuggestionRow({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  description: string
  onClick: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="press group flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-kumo-tint"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-kumo-fill text-kumo-subtle transition-colors group-hover:text-kumo-default">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] leading-[18px] font-medium tracking-[-0.25px] text-kumo-default">
            {label}
          </span>
          <span className="block truncate text-[12px] leading-4 tracking-[-0.2px] text-kumo-subtle">
            {description}
          </span>
        </span>
      </button>
    </li>
  )
}

// How many of the suggestions above to show at once. The list is longer than the page should be:
// four rows is inspiration, seven is a menu to read. Which three appear is chosen per visit, so the
// ones below the fold still get seen -- and so Home doesn't look like it only does one thing.
const VISIBLE_SUGGESTIONS = 3

function pickSuggestions(): TaskSuggestion[] {
  let shuffled = [...SUGGESTIONS]
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, VISIBLE_SUGGESTIONS)
}

export default function HomeTaskSuggestions({
  onPick,
}: {
  onPick: (prompt: string) => void
}) {
  // Chosen once per mount: re-rolling on every render would shuffle the list under the pointer.
  const visible = useMemo(pickSuggestions, [])

  return (
    <section aria-label="Tarefas de exemplo" className="flex flex-col gap-1">
      <h3 className="px-1 pb-1 text-[12px] font-medium uppercase tracking-[0.06em] text-kumo-inactive">
        Para começar
      </h3>
      <ul className="flex flex-col gap-0.5">
        {visible.map((suggestion) => (
          <SuggestionRow
            key={suggestion.id}
            icon={<suggestion.icon size={16} />}
            label={suggestion.label}
            description={suggestion.description}
            onClick={() => onPick(suggestion.prompt)}
          />
        ))}
      </ul>
    </section>
  )
}
