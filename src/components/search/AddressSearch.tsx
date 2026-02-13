import { useState, useCallback, useEffect, useRef } from 'react';
import { useGeocode } from '../../hooks/useGeocode';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useToast } from '../../hooks/useToast';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function AddressSearch() {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError, isFetched } = useGeocode(searchTerm);

  const setSearchMarker = useFavoritesStore((s) => s.setSearchMarker);
  const setMapCenter = useFavoritesStore((s) => s.setMapCenter);
  const { toast } = useToast();

  /* Quando a busca retornar resultado, atualizar mapa */
  const lastAppliedRef = useRef<string | null>(null);
  const lastSearchRef = useRef<string | null>(null);

  useEffect(() => {
    if (data && data.formattedAddress !== lastAppliedRef.current) {
      lastAppliedRef.current = data.formattedAddress;
      setSearchMarker(data.location);
      setMapCenter(data.location);
    }
  }, [data, setSearchMarker, setMapCenter]);

  /* Notificar quando não encontrar resultados */
  useEffect(() => {
    if (
      isFetched &&
      !isLoading &&
      !isError &&
      data === null &&
      searchTerm &&
      searchTerm !== lastSearchRef.current
    ) {
      lastSearchRef.current = searchTerm;
      toast(
        `Nenhum local encontrado para "${searchTerm}". Tente outro endereço.`,
        'warning',
      );
    }
  }, [isFetched, isLoading, isError, data, searchTerm, toast]);

  /* Notificar quando ocorrer erro real */
  useEffect(() => {
    if (isError && searchTerm && searchTerm !== lastSearchRef.current) {
      lastSearchRef.current = searchTerm;
      toast('Não foi possível realizar a busca. Tente novamente.', 'error');
    }
  }, [isError, searchTerm, toast]);

  const handleSubmit = useCallback(
    (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputValue.trim().length > 2) {
        lastSearchRef.current = null;
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

      {data && !isLoading && (
        <p className='text-xs text-[hsl(var(--muted-foreground))]'>
          {data.formattedAddress}
        </p>
      )}
    </form>
  );
}
