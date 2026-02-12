import { useState } from 'react';
import type { LatLng } from '../../types/map';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface SaveLocationPanelProps {
  position: LatLng;
}

export function SaveLocationPanel({ position }: SaveLocationPanelProps) {
  const [name, setName] = useState('');
  const addFavorite = useFavoritesStore((s) => s.addFavorite);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFavorite({
      name: name.trim(),
      lat: position.lat,
      lng: position.lng,
    });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2 p-1'>
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
