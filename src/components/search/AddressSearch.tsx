import { useState, useCallback, useEffect, useRef } from 'react';
import { useGeocode } from '../../hooks/useGeocode';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useToast } from '../../hooks/useToast';
import type { GeocodingResult } from '../../types/map';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function AddressSearch() {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const {
    data: results,
    isLoading,
    isError,
    isFetched,
  } = useGeocode(searchTerm);

  const setSearchMarker = useFavoritesStore((s) => s.setSearchMarker);
  const setMapCenter = useFavoritesStore((s) => s.setMapCenter);
  const { toast } = useToast();

  const lastAppliedRef = useRef<string | null>(null);
  const lastSearchRef = useRef<string | null>(null);

  /* Se houver exatamente 1 resultado, ir direto para o mapa */
  useEffect(() => {
    if (
      results &&
      results.length === 1 &&
      results[0].formattedAddress !== lastAppliedRef.current
    ) {
      lastAppliedRef.current = results[0].formattedAddress;
      setSearchMarker(results[0].location);
      setMapCenter(results[0].location);
      toast(results[0].formattedAddress, 'success');
    }
  }, [results, setSearchMarker, setMapCenter, toast]);

  /* Notificar quando não encontrar resultados */
  useEffect(() => {
    if (
      isFetched &&
      !isLoading &&
      !isError &&
      results &&
      results.length === 0 &&
      searchTerm &&
      searchTerm !== lastSearchRef.current
    ) {
      lastSearchRef.current = searchTerm;
      toast(
        `Nenhum local encontrado para "${searchTerm}". Tente outro endereço.`,
        'warning',
      );
    }
  }, [isFetched, isLoading, isError, results, searchTerm, toast]);

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
        lastAppliedRef.current = null;
        setSelectedAddress(null);
        setSearchTerm(inputValue.trim());
      }
    },
    [inputValue],
  );

  const handleSelectResult = useCallback(
    (result: GeocodingResult) => {
      lastAppliedRef.current = result.formattedAddress;
      setSelectedAddress(result.formattedAddress);
      setSearchMarker(result.location);
      setMapCenter(result.location);
      toast(result.formattedAddress, 'success');
    },
    [setSearchMarker, setMapCenter, toast],
  );

  const showResultsList = !isLoading && results && results.length > 1;

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

      {/* Resultado único — exibe inline como antes */}
      {!isLoading && results && results.length === 1 && (
        <p className='text-xs text-[hsl(var(--muted-foreground))]'>
          {results[0].formattedAddress}
        </p>
      )}

      {/* Múltiplos resultados — lista clicável */}
      {showResultsList && (
        <div className='flex flex-col gap-1'>
          <p className='text-[11px] font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]'>
            {results.length} resultados encontrados
          </p>
          <ul className='flex flex-col gap-1'>
            {results.map((result, idx) => (
              <li key={idx}>
                <Button
                  type='button'
                  variant={
                    selectedAddress === result.formattedAddress
                      ? 'primary'
                      : 'ghost'
                  }
                  size='sm'
                  onClick={() => handleSelectResult(result)}
                  className={`
                    w-full justify-start text-left text-xs
                    border border-[hsl(var(--border))]
                    hover:border-[hsl(var(--primary))]/60
                    ${
                      selectedAddress === result.formattedAddress
                        ? 'border-[hsl(var(--primary))]'
                        : ''
                    }
                  `}
                >
                  <span className='flex items-start gap-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      className='mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60'
                    >
                      <path
                        fillRule='evenodd'
                        d='M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span className='leading-snug'>
                      {result.formattedAddress}
                    </span>
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
