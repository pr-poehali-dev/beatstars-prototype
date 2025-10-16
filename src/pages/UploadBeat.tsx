import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const allTags = ['Trap', 'Hip-Hop', 'Boom Bap', 'EDM', 'Lo-Fi', 'Dubstep', 'Dark', 'Chill', 'Melodic', 'Heavy Bass', 'Old School', 'Energetic'];

export default function UploadBeat() {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    bpm: '',
    price: '',
    description: ''
  });
  const [uploading, setUploading] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (!audioFile) {
        alert('Выберите аудио файл');
        setUploading(false);
        return;
      }

      const audioBase64 = await fileToBase64(audioFile);
      const coverBase64 = coverFile ? await fileToBase64(coverFile) : null;

      const payload = {
        title: formData.title,
        bpm: parseInt(formData.bpm),
        price: parseInt(formData.price),
        description: formData.description,
        tags: selectedTags,
        audioFile: {
          name: audioFile.name,
          data: audioBase64,
          type: audioFile.type
        },
        ...(coverBase64 && coverFile ? {
          coverFile: {
            name: coverFile.name,
            data: coverBase64,
            type: coverFile.type
          }
        } : {})
      };

      const response = await fetch('https://functions.poehali.dev/3fdbf1b4-1176-4abb-add6-a01aed3b0982', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`Бит "${result.metadata.title}" успешно загружен!`);
        navigate('/profile');
      } else {
        alert(`Ошибка: ${result.error || 'Не удалось загрузить бит'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Произошла ошибка при загрузке');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Icon name="Music" className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-white">
                BEATVARD
              </h1>
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  <Icon name="Home" size={18} className="mr-2" />
                  Главная
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  <Icon name="UserCircle" size={18} className="mr-2" />
                  Профиль
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Загрузить новый бит</h2>
            <p className="text-muted-foreground">Заполните форму и загрузите свой трек на платформу</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="bg-card border-border p-8 mb-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base font-semibold mb-2 block">
                    Название трека *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Midnight Vibes"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="text-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bpm" className="text-base font-semibold mb-2 block">
                      BPM *
                    </Label>
                    <Input
                      id="bpm"
                      type="number"
                      placeholder="140"
                      value={formData.bpm}
                      onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-base font-semibold mb-2 block">
                      Цена (₽) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="2500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-base font-semibold mb-2 block">
                    Описание
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Расскажите о вашем бите, настроении, инструментах..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Жанры и настроение *
                  </Label>
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
                  {selectedTags.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Выбрано: {selectedTags.length} тег(ов)
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="audio" className="text-base font-semibold mb-2 block">
                    Аудио файл (MP3, WAV) *
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors">
                    <input
                      id="audio"
                      type="file"
                      accept="audio/mp3,audio/wav,audio/mpeg"
                      onChange={handleAudioChange}
                      className="hidden"
                      required
                    />
                    <label htmlFor="audio" className="cursor-pointer flex flex-col items-center">
                      <Icon name="Upload" size={48} className="text-muted-foreground mb-3" />
                      {audioFile ? (
                        <div className="text-center">
                          <p className="font-semibold text-white mb-1">{audioFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="font-semibold mb-1">Нажмите для загрузки аудио</p>
                          <p className="text-sm text-muted-foreground">MP3 или WAV до 100MB</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="cover" className="text-base font-semibold mb-2 block">
                    Обложка (необязательно)
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors">
                    <input
                      id="cover"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                    <label htmlFor="cover" className="cursor-pointer flex flex-col items-center">
                      <Icon name="Image" size={48} className="text-muted-foreground mb-3" />
                      {coverFile ? (
                        <div className="text-center">
                          <p className="font-semibold text-white mb-1">{coverFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(coverFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="font-semibold mb-1">Нажмите для загрузки обложки</p>
                          <p className="text-sm text-muted-foreground">PNG или JPG до 10MB</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/profile')}
              >
                <Icon name="X" size={18} className="mr-2" />
                Отмена
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-black hover:bg-black/80 text-white"
                disabled={uploading || !audioFile || !formData.title || !formData.bpm || !formData.price || selectedTags.length === 0}
              >
                {uploading ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Icon name="Upload" size={18} className="mr-2" />
                    Опубликовать бит
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}