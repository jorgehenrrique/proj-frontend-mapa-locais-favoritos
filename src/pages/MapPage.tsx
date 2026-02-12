import { MapView } from '../components/map/MapView';
import { AddressSearch } from '../components/search/AddressSearch';
import { FavoritesList } from '../components/favorites/FavoritesList';

export function MapPage() {
  return (
    <div className='flex h-dvh flex-col lg:flex-row overflow-hidden'>
      {/* Sidebar */}
      <aside className='flex w-full shrink-0 flex-col border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] max-h-[45dvh] lg:max-h-none lg:h-full lg:w-96 lg:border-b-0 lg:border-r'>
        {/* Header */}
        <header className='border-b border-[hsl(var(--border))] px-4 py-3 lg:py-4'>
          <h1 className='text-base lg:text-lg font-bold text-[hsl(var(--foreground))]'>
            Mapa de Locais Favoritos
          </h1>
          <p className='mt-0.5 text-xs text-[hsl(var(--muted-foreground))]'>
            Busque, explore e salve seus locais preferidos
          </p>
        </header>

        {/* Busca */}
        <div className='border-b border-[hsl(var(--border))] px-4 py-3'>
          <AddressSearch />
        </div>

        {/* Lista de favoritos */}
        <div className='flex-1 overflow-y-auto px-4 py-3'>
          <h2 className='mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]'>
            Locais Salvos
          </h2>
          <FavoritesList />
        </div>
      </aside>

      {/* Mapa */}
      <main className='relative min-h-0 flex-1'>
        <MapView />
      </main>
    </div>
  );
}
