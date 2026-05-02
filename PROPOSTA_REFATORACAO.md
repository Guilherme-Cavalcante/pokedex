# Proposta de Refatoração

## Padrão escolhido

Foi escolhido o padrão MVVM em relação ao MVP devido à maior harmonia com o _framework_ reativo do _React Native_, oferecendo ainda menor acoplamento, além de maior praticidade de implementação e legibilidade.

## Estrutura de arquivos

```text
pokedex-app/  
├─ screens/
│  └─ Pokedex/
│     ├─ PokedexScreen.tsx                  (View)
│     ├─ usePokedex_ViewModel.ts            (ViewModel)
│  └─ PokemonDetails/
|     ├─ PokemonDetailsScreen.tsx           (View)
│     └─ usePokemonDetails_ViewModel.ts     (ViewModel)
├─ components/
│  └─ PokemonCard.tsx
├─ services/
│  └─ api.tsx
├─ types/
│  ├─ Navigation.ts
│  └─ Pokemon.ts
├─ utils/
│  └─ format.ts
```
