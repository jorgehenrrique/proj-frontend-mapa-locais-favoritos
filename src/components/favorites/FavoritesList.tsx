import { useFavoritesStore } from '../../stores/favoritesStore';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../hooks/useConfirm';
import { Button } from '../ui/Button';

export function FavoritesList() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const selectedPlace = useFavoritesStore((s) => s.selectedPlace);
  const selectPlace = useFavoritesStore((s) => s.selectPlace);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const { toast } = useToast();
  const { confirm } = useConfirm();

  if (favorites.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center gap-2 py-8 text-center'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-10 w-10 text-[hsl(var(--muted-foreground))] opacity-50'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={1.5}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
          />
        </svg>
        <p className='text-sm text-[hsl(var(--muted-foreground))]'>
          Nenhum local salvo ainda
        </p>
        <p className='text-xs text-[hsl(var(--muted-foreground))] opacity-70'>
          Clique no mapa ou busque um endereço para salvar
        </p>
      </div>
    );
  }

  return (
    <ul className='flex flex-col gap-2'>
      {favorites.map((place) => {
        const isSelected = selectedPlace?.id === place.id;
        return (
          <li
            key={place.id}
            role='button'
            tabIndex={0}
            onClick={() => {
              selectPlace(isSelected ? null : place);
              if (!isSelected) toast(`"${place.name}" selecionado`, 'info');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectPlace(isSelected ? null : place);
                if (!isSelected) toast(`"${place.name}" selecionado`, 'info');
              }
            }}
            className={`group flex items-center justify-between rounded-lg border px-3 py-2.5 transition-all cursor-pointer ${
              isSelected
                ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10'
                : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50 hover:bg-[hsl(var(--muted))]/50'
            }`}
          >
            <div className='flex flex-col gap-0.5 min-w-0'>
              <span className='truncate text-sm font-medium text-[hsl(var(--foreground))]'>
                {place.name}
              </span>
              <span className='text-[11px] text-[hsl(var(--muted-foreground))]'>
                {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
              </span>
            </div>
            <Button
              variant='danger'
              size='sm'
              className={`ml-2 shrink-0 transition-opacity ${
                isSelected
                  ? 'opacity-100'
                  : 'opacity-0 lg:group-hover:opacity-100'
              }`}
              onClick={async (e) => {
                e.stopPropagation();
                const confirmed = await confirm({
                  title: 'Remover local favorito',
                  message: `Tem certeza que deseja remover "${place.name}" dos seus favoritos?`,
                  confirmLabel: 'Remover',
                  cancelLabel: 'Cancelar',
                });
                if (confirmed) {
                  removeFavorite(place.id);
                  toast(`"${place.name}" removido dos favoritos`, 'info');
                }
              }}
              aria-label={`Remover ${place.name}`}
            >
              Remover
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
