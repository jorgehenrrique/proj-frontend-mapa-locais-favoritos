import { useState, useCallback, useEffect, useRef } from 'react';
import { useGeocode } from '../../hooks/useGeocode';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function AddressSearch() {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError, error } = useGeocode(searchTerm);

  const setSearchMarker = useFavoritesStore((s) => s.setSearchMarker);
  const setMapCenter = useFavoritesStore((s) => s.setMapCenter);

  /* Quando a busca retornar resultado, atualizar mapa */
  const lastAppliedRef = useRef<string | null>(null);

  useEffect(() => {
    if (data && data.formattedAddress !== lastAppliedRef.current) {
      lastAppliedRef.current = data.formattedAddress;
      setSearchMarker(data.location);
      setMapCenter(data.location);
    }
  }, [data, setSearchMarker, setMapCenter]);

  const handleSubmit = useCallback(
    (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputValue.trim().length > 2) {
        setSearchTerm(inputValue.trim());
      }
    },
    [inputValue],
  );

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
      <div className='flex gap-2'>
        <div className='flex-1'>
          <Input
            placeholder='Buscar endereço ou local...'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-label='Buscar endereço'
          />
        </div>
        <Button
          type='submit'
          disabled={isLoading || inputValue.trim().length < 3}
        >
          {isLoading ? (
            <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
          ) : (
            'Buscar'
          )}
        </Button>
      </div>

      {isLoading && (
        <p className='text-xs text-[hsl(var(--muted-foreground))]'>
          Buscando endereço...
        </p>
      )}

      {isError && (
        <p className='text-xs text-red-500'>
          Erro ao buscar: {(error as Error)?.message ?? 'tente novamente'}
        </p>
      )}

      {data && !isLoading && (
        <p className='text-xs text-[hsl(var(--muted-foreground))]'>
          {data.formattedAddress}
        </p>
      )}
    </form>
  );
}
