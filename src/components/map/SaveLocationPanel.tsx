import { useState } from 'react';
import type { LatLng } from '../../types/map';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useToast } from '../../hooks/useToast';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface SaveLocationPanelProps {
  position: LatLng;
  onClose?: () => void;
}

export function SaveLocationPanel({
  position,
  onClose,
}: SaveLocationPanelProps) {
  const [name, setName] = useState('');
  const addFavorite = useFavoritesStore((s) => s.addFavorite);
  const { toast } = useToast();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    const result = addFavorite({
      name: name.trim(),
      lat: position.lat,
      lng: position.lng,
    });

    if (!result.success) {
      toast(result.error!, 'warning');
      return;
    }

    toast(`"${name.trim()}" salvo com sucesso!`, 'success');
    setName('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='relative flex flex-col gap-2 p-0 overflow-hidden'
    >
      {/* Botão fechar */}
      {onClose && (
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={onClose}
          aria-label='Fechar'
          className='absolute -top-0.5 -right-0.5 h-6 w-6 rounded-full p-0! '
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className='h-4 w-4 text-gray-400 '
          >
            <path d='M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z' />
          </svg>
        </Button>
      )}

      <p className='text-xs font-semibold text-gray-700'>Salvar este local</p>
      <p className='text-[11px] text-gray-500'>
        {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
      </p>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Nome do local'
        className='py-1! text-xs! text-gray-800! bg-white! border-gray-300! focus:border-blue-500!'
        autoFocus
      />
      <Button type='submit' disabled={!name.trim()} size='sm'>
        Salvar como favorito
      </Button>
    </form>
  );
}
