# Design System — Parceiros CPAD Belém

> Fase 2 — fundação visual. Os tokens abaixo são a fonte de verdade para componentes novos e para a refatoração gradual das telas legadas.

## Direção visual

Institucional editorial: vinho profundo para confiança e pertencimento, dourado reservado para chamadas de valor e uma base branca/areia para leitura comercial. Títulos usam Playfair Display; interfaces, Manrope. A linguagem evita fundos decorativos e excesso de bordas arredondadas.

## Tokens

| Papel | Token | Valor |
| --- | --- | --- |
| Marca | `--color-wine` | `#750B2A` |
| Marca escura | `--color-wine-dark` | `#51071F` |
| Destaque | `--color-gold` | `#C3944D` |
| Destaque claro | `--color-gold-light` | `#F1C77D` |
| Canvas | `--color-canvas` | `#FFFFFF` |
| Superfície | `--color-surface` | `#F8F7F5` |
| Texto | `--color-text` | `#202020` |
| Texto secundário | `--color-text-muted` | `#666666` |
| Borda | `--color-border` | `#E8E4E0` |
| Foco | `--color-focus` | `#A96E1C` |

## Componentes-base

- Botões: primário vinho, secundário contornado, ghost e destrutivo; altura mínima de 44 px nos fluxos públicos.
- Campos: fundo branco, borda neutra, foco dourado perceptível e rótulo associado.
- Cards: raio de 12 px, borda neutra e sombra discreta `--shadow-card`.
- Navegação: barra superior branca para busca e ações; barra vinho para categorias e rotas; painel móvel expansível com os mesmos destinos.
- Rodapé: vinho escuro, contraste alto e apenas links/canais efetivamente disponíveis.

## Responsividade e acessibilidade

- Mobile-first a partir de 320 px, sem overflow horizontal.
- A navegação troca para botão de menu abaixo de `lg`; busca fica no painel móvel abaixo de `md`.
- Controles têm estados hover, focus visível e rótulos acessíveis.
- Rotas ainda não implementadas aparecem como `Em breve`; não são links que levem a erro 404.
