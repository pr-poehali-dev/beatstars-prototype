import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface Beat {
  id: number;
  title: string;
  producer: string;
  bpm: number;
  price: number;
  tags: string[];
  imageUrl: string;
}

const mockBeats: Beat[] = [
  {
    id: 1,
    title: 'Midnight Vibes',
    producer: 'DJ Астронавт',
    bpm: 140,
    price: 2500,
    tags: ['Trap', 'Dark', 'Heavy Bass'],
    imageUrl: 'https://v3b.fal.media/files/b/kangaroo/EIhOPd6ax_1mixLimAshA_output.png'
  },
  {
    id: 2,
    title: 'Summer Dreams',
    producer: 'BeatMaker Pro',
    bpm: 128,
    price: 3000,
    tags: ['Hip-Hop', 'Chill', 'Melodic'],
    imageUrl: 'https://v3b.fal.media/files/b/kangaroo/EIhOPd6ax_1mixLimAshA_output.png'
  },
  {
    id: 3,
    title: 'Urban Flow',
    producer: 'Sound Wave',
    bpm: 95,
    price: 2000,
    tags: ['Boom Bap', 'Old School', 'Vinyl'],
    imageUrl: 'https://v3b.fal.media/files/b/kangaroo/EIhOPd6ax_1mixLimAshA_output.png'
  },
  {
    id: 4,
    title: 'Electric Night',
    producer: 'DJ Астронавт',
    bpm: 150,
    price: 3500,
    tags: ['EDM', 'Energetic', 'Club'],
    imageUrl: 'https://v3b.fal.media/files/b/kangaroo/EIhOPd6ax_1mixLimAshA_output.png'
  },
  {
    id: 5,
    title: 'Lofi Sunset',
    producer: 'Chill Beats',
    bpm: 85,
    price: 1800,
    tags: ['Lo-Fi', 'Chill', 'Study'],
    imageUrl: 'https://v3b.fal.media/files/b/kangaroo/EIhOPd6ax_1mixLimAshA_output.png'
  },
  {
    id: 6,
    title: 'Bass Drop',
    producer: 'Sound Wave',
    bpm: 145,
    price: 4000,
    tags: ['Dubstep', 'Heavy', 'Bass'],
    imageUrl: 'https://v3b.fal.media/files/b/kangaroo/EIhOPd6ax_1mixLimAshA_output.png'
  }
];

const allTags = ['Trap', 'Hip-Hop', 'Boom Bap', 'EDM', 'Lo-Fi', 'Dubstep', 'Dark', 'Chill', 'Melodic', 'Heavy Bass', 'Old School', 'Energetic'];

export default function Index() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [cart, setCart] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [volume, setVolume] = useState([75]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredBeats = mockBeats.filter(beat => {
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => beat.tags.includes(tag));
    const matchesSearch = beat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         beat.producer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTags && matchesSearch;
  });

  const togglePlay = (id: number) => {
    setCurrentlyPlaying(prev => prev === id ? null : id);
  };

  const addToCart = (id: number) => {
    if (!cart.includes(id)) {
      setCart([...cart, id]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Icon name="Music" className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-white">
                BEATVARD
              </h1>
            </div>
            <nav className="flex items-center gap-6">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Icon name="Home" size={18} className="mr-2" />
                Главная
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Icon name="Library" size={18} className="mr-2" />
                Каталог
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Icon name="User" size={18} className="mr-2" />
                Продюсеры
              </Button>
              <Button variant="ghost" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative mb-6">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Поиск битов, продюсеров..."
              className="pl-10 bg-card border-border text-lg h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Фильтр по жанрам и настроению:</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer hover-scale ${
                    selectedTags.includes(tag) 
                      ? 'bg-black text-white border-white' 
                      : 'hover:border-white border-white/50 text-white'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {filteredBeats.map(beat => (
            <Card key={beat.id} className="bg-card border-border overflow-hidden hover-scale group">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-16">
                    <svg viewBox="0 0 100 40" className={currentlyPlaying === beat.id ? 'animate-pulse-slow' : ''}>
                      {[...Array(20)].map((_, i) => (
                        <rect
                          key={i}
                          x={i * 5}
                          y={20 - Math.random() * 15}
                          width="3"
                          height={Math.random() * 30}
                          fill="white"
                          opacity="0.8"
                        />
                      ))}
                    </svg>
                  </div>
                </div>
                <Button
                  size="icon"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white hover:bg-white hover:scale-110 transition-all group-hover:scale-110"
                  onClick={() => togglePlay(beat.id)}
                >
                  <Icon name={currentlyPlaying === beat.id ? "Pause" : "Play"} className="text-white" size={24} />
                </Button>
              </div>
              
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{beat.title}</h3>
                    <p className="text-sm text-muted-foreground">{beat.producer}</p>
                  </div>
                  <Badge variant="outline" className="bg-muted/50">
                    {beat.bpm} BPM
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {beat.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    ₽{beat.price.toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="hover:border-primary">
                      <Icon name="FileText" size={18} />
                    </Button>
                    <Button 
                      className="bg-black hover:bg-black/80 text-white"
                      onClick={() => addToCart(beat.id)}
                      disabled={cart.includes(beat.id)}
                    >
                      <Icon name={cart.includes(beat.id) ? "Check" : "ShoppingCart"} size={18} className="mr-2" />
                      {cart.includes(beat.id) ? 'В корзине' : 'Купить'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {currentlyPlaying !== null && (
          <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border p-4 z-50">
            <div className="container mx-auto">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg flex-shrink-0 bg-black" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">
                    {mockBeats.find(b => b.id === currentlyPlaying)?.title}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {mockBeats.find(b => b.id === currentlyPlaying)?.producer}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button size="icon" variant="ghost">
                    <Icon name="SkipBack" size={20} />
                  </Button>
                  <Button 
                    size="icon" 
                    className="w-12 h-12 bg-black hover:bg-black/80"
                    onClick={() => setCurrentlyPlaying(null)}
                  >
                    <Icon name="Pause" size={24} />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Icon name="SkipForward" size={20} />
                  </Button>
                </div>
                <div className="flex items-center gap-3 w-32">
                  <Icon name="Volume2" size={20} className="text-muted-foreground" />
                  <Slider 
                    value={volume} 
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}