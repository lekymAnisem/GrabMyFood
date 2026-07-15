import { useState } from 'react';
import { useParams } from 'react-router-dom';
import MenuCategory from '../components/MenuCategory';
import MenuItemCard from '../components/MenuItemCard';
import CartDrawer from '../components/CartDrawer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useCart } from '../hooks/useCart';

const CATEGORIES = ['Antipasti', 'Primi Piatti', 'Secondi Piatti', 'Contorni', 'Dolci & Caffè', 'Vini Selection'];

const MENU_ITEMS = [
  { id: 1, category: 'Antipasti', name: 'Burrata Pugliese', price: 18.00, description: 'Fresh Puglia burrata served with heirloom tomatoes, aged balsamic reduction, and organic basil oil.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVk1Wb1wI5FSvx3Dihn_LiGcgaJYGrFvN14YPuBMCDuxIovV11i7_2j5bq3oVT04UTcZMlUSFalaXN6CsG0_P1WJYqDM0h3Qc4AnzJKJmOMAIZUXBIcXyOyHMPaWwZr-rv8mIaf13C4zZpQhenw3vw9ncBtpZxEs0JjLhrQnW9RoNHJWslU1p3ZFtOlGNu1vaRtOUF3yuuSoaNIoMjcbxK176nODK5EhSznyXDNZtiMnYV4IsztTnQnP2KqkZZrdpKmEJpAYCdQq8', calories: 420, tags: ['Vegetarian'] },
  { id: 2, category: 'Antipasti', name: 'Carpaccio di Manzo', price: 22.00, description: 'Wafer-thin beef tenderloin, wild rocket, 24-month aged Parmigiano, and lemon-truffle vinaigrette.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHC36g6MwWUa9zEgzAl17PnzCm1Dw2IXdmfAUIcx1oXuDLpUTNfBJCFNflrL_dxoY9jjcNxdySuhg_5ehbeAYK2qf1ZV7z7ry1Ghzi-bP9s_-VLc8I5i5nbULoXodDqbRK27STwuxBvJxgk8COSRM69thHVlG3qA87TshhpMD5HdtTSbE4bjnhk64RpSFx2rH99cNNP_0Lg8yyyj3jzE7d2nrInuvjIJqv8OXjMzulc_sXGmQpV1yWkToaoY6eb7kSIZif4U66BAk', calories: 310 },
  { id: 3, category: 'Antipasti', name: 'Calamari Fritti', price: 19.50, description: 'Crisp local squid rings with house-made spicy pomodoro and charred Sicilian lemon.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDv8VRHAJuqAxosm5G1hRcXwE9HzmBsl25he1at2fg45OhxOfXCCFg-wsI4WklSUdUT2DCLVLlraISLa_hy45ddCeYW2IDdk_263Ad3yvDl2BvaHzJQHkUCYTvsgn3t2QduKGqaOPIFBNq_WZK9e_plNcGfLRQRaMJ9gkDtI7-iENq1xoPS6jFXY3R8EgYoYnr5Cposk3GBJ7Lyd9tbn9jYjYlYjIlnfP4djbIBUY1JB9cZqJJAyvOEZ3j9KhlwCCVfh9jD1jowBgk', calories: 540 },
  { id: 4, category: 'Antipasti', name: 'Bruschetta Mista', price: 14.00, description: 'Duo of roasted sourdough: classic tomato-basil and whipped ricotta with fig jam.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB37ikrHWfmAtryEwop9A0dhOntK5PrL7Ls9pjoBBj7RSdS7Uf73rXocYXfGvrSeApWKqd8POJwuQJH3tyFQyn6LFj0bfhRm7_Lo9hLFTz3rdVmSdF5Qh_v3DrAndjAQNC6LskTu85vuX4BYZK2VxLBm4Rl4HfHI1gEF5uABGY-JQnuCYchVqm-N3ln2wH8eDsqjS62Qy8YTj5cLEXAELJH15FZsDIt_Cx8rLA5I34I-zpLZ1XkyuaBWGvrP2s0t9HDm72pwXEWT4Q', calories: 380, tags: ['Vegetarian'] },
];

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState('Antipasti');
  const [cartOpen, setCartOpen] = useState(false);
  const [loading] = useState(false);
  const [error] = useState(null);

  const handleAddToCart = (item) => {
    addItem(item, parseInt(id));
    setCartOpen(true);
  };

  if (loading) return <LoadingSpinner message="Loading restaurant..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  const filteredItems = MENU_ITEMS.filter(i => i.category === activeCategory);

  return (
    <div>
      <section className="relative h-[480px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDwau_WuzYEzprqxI0PBkoKqzsOS_ga-7-UMLBD89TAEPqNXE81bRHjHLn5zDS5qtPXcfUCDf25xsfKTpSPjtlvxk34YnyhINp_ehqs6TQ7JubTmnAQoJg07vtpR3vmVFILgLaZelVlTWNLYSqzMEkwKdLGvU9KKm0skuj2GKswRQwEIx7Ge2FZ1xIq70UDHWokdEgKnHL6u1HywfWqrYcFH-luEjnhINePD2zmCVXoPdIqR4nOGV6FKweppj4SRjVPnwX0_9yeWFc')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 w-full px-margin-desktop max-w-container-max left-1/2 -translate-x-1/2 pb-stack-xl flex flex-col md:flex-row md:items-end justify-between gap-stack-lg">
          <div className="space-y-stack-sm">
            <div className="flex items-center gap-3">
              <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-3xl">restaurant</span>
              </div>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-label-sm uppercase tracking-wider">Premium Italian</span>
            </div>
            <h1 className="font-display-lg text-display-lg text-white">L'Anima di Roma</h1>
            <div className="flex items-center gap-6 text-white/90 font-label-md">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span>4.8 (2.4k+ Reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined">schedule</span>
                <span>25-35 min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined">delivery_dining</span>
                <span>Free Delivery</span>
              </div>
            </div>
          </div>
          <div className="flex gap-stack-md">
            <button className="bg-white text-on-surface px-8 py-3 rounded-xl font-label-md hover:bg-surface-container transition-colors shadow-xl">Group Order</button>
            <button className="bg-primary text-white px-8 py-3 rounded-xl font-label-md hover:opacity-90 transition-opacity shadow-xl">Book a Table</button>
          </div>
        </div>
      </section>

      <section className="max-w-container-max mx-auto px-margin-desktop py-stack-xl flex flex-col lg:flex-row gap-gutter">
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-28 space-y-2">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-md px-2">Menu</h3>
            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 gap-2 custom-scrollbar">
              {CATEGORIES.map(cat => (
                <MenuCategory key={cat} name={cat} isActive={activeCategory === cat} onClick={setActiveCategory} />
              ))}
            </nav>
          </div>
        </aside>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-stack-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">{activeCategory}</h2>
            <div className="flex gap-2">
              <span className="px-4 py-1.5 bg-secondary-container text-primary font-label-md rounded-full text-xs">Vegetarian</span>
              <span className="px-4 py-1.5 bg-surface-container-low text-on-surface-variant font-label-md rounded-full text-xs">Gluten Free</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
            {filteredItems.map(item => (
              <MenuItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />
            ))}
          </div>
          <div className="mt-stack-xl p-stack-lg bg-surface-container-low rounded-xxl flex flex-col md:flex-row items-center gap-stack-lg border border-primary/5">
            <div className="flex-1 space-y-2">
              <span className="text-primary font-label-md uppercase tracking-wider">Next up</span>
              <h3 className="font-display-lg-mobile text-display-lg-mobile md:text-headline-lg">Primi Piatti: Handmade Pasta</h3>
              <p className="text-on-surface-variant">Discover our selection of fresh pasta made daily in our lab using imported Italian flour and organic eggs.</p>
              <button onClick={() => setActiveCategory('Primi Piatti')} className="mt-4 flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
                Explore Collection <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="w-full md:w-64 h-48 rounded-xl overflow-hidden shadow-lg">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnxLAGNxPUKfragocPZQHc79Q0NlosyANRJU47BRkOYgAG0czvbMVaeC-BbLM8fRCKCnr8FZQi1GddLcOwGirBkFmy170twrnNOsoPafb4ty6u-3n3XaieXktVrSmzoZAQbm6QtOcZ4kkN7UhFGYWYGucaG_jzZ4QWF26X_1F-uvUQXH9mM-Ojjf5sDqx8PwQ413PyA3ERZx6A3aFACK2bnuBfx0J8dimvtIbwnK8O9vu6V1At7eAA3NFusOgYmh4qthn2Nc-X_yk" alt="Pasta" />
            </div>
          </div>
        </div>
      </section>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
