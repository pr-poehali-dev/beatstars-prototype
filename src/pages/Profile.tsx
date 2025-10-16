import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

interface Purchase {
  id: number;
  beatTitle: string;
  producer: string;
  price: number;
  date: string;
  licenseType: string;
}

interface Upload {
  id: number;
  title: string;
  bpm: number;
  plays: number;
  sales: number;
  revenue: number;
}

const mockPurchases: Purchase[] = [
  {
    id: 1,
    beatTitle: 'Midnight Vibes',
    producer: 'DJ Астронавт',
    price: 2500,
    date: '15.10.2024',
    licenseType: 'Basic'
  },
  {
    id: 2,
    beatTitle: 'Urban Flow',
    producer: 'Sound Wave',
    price: 2000,
    date: '10.10.2024',
    licenseType: 'Premium'
  }
];

const mockUploads: Upload[] = [
  {
    id: 1,
    title: 'Dark Streets',
    bpm: 140,
    plays: 1250,
    sales: 8,
    revenue: 20000
  },
  {
    id: 2,
    title: 'City Lights',
    bpm: 128,
    plays: 890,
    sales: 5,
    revenue: 12500
  }
];

export default function Profile() {
  const [cart] = useState<number[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [userName, setUserName] = useState('DJ Астронавт');
  const [userEmail] = useState('dj@beatvard.com');

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
        <div className="max-w-6xl mx-auto">
          <Card className="bg-card border-border p-8 mb-8">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" />
                <AvatarFallback className="bg-black text-white text-3xl">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  {editMode ? (
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="text-2xl font-bold max-w-xs"
                    />
                  ) : (
                    <h2 className="text-3xl font-bold">{userName}</h2>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                  >
                    <Icon name={editMode ? "Check" : "Pencil"} size={16} className="mr-2" />
                    {editMode ? 'Сохранить' : 'Редактировать'}
                  </Button>
                </div>
                <p className="text-muted-foreground mb-4">{userEmail}</p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-2xl font-bold">{mockPurchases.length}</p>
                    <p className="text-sm text-muted-foreground">Покупок</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockUploads.length}</p>
                    <p className="text-sm text-muted-foreground">Загружено</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      ₽{mockUploads.reduce((sum, u) => sum + u.revenue, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Заработано</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Tabs defaultValue="purchases" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="purchases">Мои покупки</TabsTrigger>
              <TabsTrigger value="uploads">Мои биты</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
            </TabsList>

            <TabsContent value="purchases">
              <div className="space-y-4">
                {mockPurchases.map(purchase => (
                  <Card key={purchase.id} className="bg-card border-border p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
                          <Icon name="Music" className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">{purchase.beatTitle}</h3>
                          <p className="text-sm text-muted-foreground">{purchase.producer}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{purchase.licenseType}</Badge>
                            <Badge variant="secondary">{purchase.date}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white mb-2">
                          ₽{purchase.price.toLocaleString()}
                        </p>
                        <Button variant="outline" size="sm">
                          <Icon name="Download" size={16} className="mr-2" />
                          Скачать
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="uploads">
              <div className="space-y-4">
                {mockUploads.map(upload => (
                  <Card key={upload.id} className="bg-card border-border p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
                          <Icon name="Music" className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">{upload.title}</h3>
                          <Badge variant="outline" className="bg-muted/50">
                            {upload.bpm} BPM
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-8 items-center">
                        <div className="text-center">
                          <p className="text-xl font-bold">{upload.plays}</p>
                          <p className="text-xs text-muted-foreground">Прослушиваний</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold">{upload.sales}</p>
                          <p className="text-xs text-muted-foreground">Продаж</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-white">
                            ₽{upload.revenue.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Доход</p>
                        </div>
                        <Button variant="outline" size="icon">
                          <Icon name="MoreVertical" size={18} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button className="w-full bg-black hover:bg-black/80 text-white">
                  <Icon name="Upload" size={18} className="mr-2" />
                  Загрузить новый бит
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-6">Настройки аккаунта</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Имя пользователя</label>
                    <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input value={userEmail} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Пароль</label>
                    <Button variant="outline">Изменить пароль</Button>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-lg font-semibold mb-4">Платёжные данные</h4>
                    <Button variant="outline">
                      <Icon name="CreditCard" size={18} className="mr-2" />
                      Добавить способ оплаты
                    </Button>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <Button className="bg-black hover:bg-black/80 text-white">
                      Сохранить изменения
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
