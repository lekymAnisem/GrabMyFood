import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import RestaurantCard from '../components/RestaurantCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = [
  { name: 'Pizza', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUJivoEjAWR9hIfJre_s4tct0mkIQuIwOySSCMMnZeNFg5nOprSrVfXVn7zAT5IJ1wQi0vgTrwq6diZMcKIMxjdsQ_KWuf_pbHxcrZ_zKTC6tkIT3gEX8Hd5JjKJ6cDoYHRKYAjh2tzwdoZOHgMa0QhD8GYhXad_cwkgTTETDVcmNLpXaV53M_2Trz4kHIw5JOB9zVhjXgTL1z8cFee71aBrQdkQhJ_X3EIYefoAigqH7DDEEJIu9glYyDI4GJ4A1yR7jLIVoCsEo' },
  { name: 'Burgers', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy5s2V6VYo8eNH7bu_ac8TtjHLZZBq4GI6-fC-dAf9WPug1FrYYPUIVH2HycJtP6kRMPoLMOI714apB6o-lFl712a3TtKIIz2rUKzEHxO-NfXVt95Is9umLwahJhmDUJGkv9QMyc9WyMnUOmxR-A6Iq85Z_TyFFpQA9gRibZcywUPMogqdgfqlQhzxAeynxA0qBUlA3p5dCvIY_G93CWzXP3KLJ5kq__UAKygSywwG1pRsxDATWVjBvI4THh2T4eJg8kM2FGV52OA' },
  { name: 'Sushi', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA127feajPPpVlOdQELe4J5kDpB3QM-08DNPjS2F5aDdXbp2CsKcp0cSYQQqvjrIvVEQ_OpjH4Q8Qw0XNdV5wnCipCROUNXQEE22Y_RjKGSXRCOEZx6c2bwM83Q3Ex9gGrZ7JCVw-yi8g_YxtSg4n4i9P1dnS9UYvRP6EvSEIu5nouNnu6x2rN_sKTNKE73kVwVyv5zxjkZX5hH0yZAfBmW84El8QptrOcrAF65rav6juWGH7vEu61Zt_s17teCjmdsDYDQsQO7G9w' },
  { name: 'Healthy', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJjCobKQwpFeucTSgLEtct0BPKCH4Jqck_bu9lwAL20YZDupXrPIuAQm-YbpgSAQ4JzywWIS4ks88iAj_bVy0oyEK4yotPbhlaxoezDr6ocQVPrT3CxN5YI6v8155zeiQAPLvd6NK7-kBKOITWzaIcN93GFXOBxaJiwd9r5HRPsTS9gWeeEjmu2ckvyV4M42dmW4Z2aanw4u6Le92CZptnKh6AL2KglmKgPOqA4db0pCU0kH-kNOIyoPpS4KwVydRH2jFdEIy6VNI' },
  { name: 'Desserts', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjgSA-wALs2Tv-cCjsfFfr3ci7hpQL5zguJVqiYpgLUWn6PLqb4dSPQCbQgJQjUZqRKjUXoRn4rxZHTnet04VeTwhYGLazlvWJU0VLe3PBPslSfTVkil8cpfUvGVMqyJA-TFPebNepJ65zMtNpju54Hhr1thrfSNFj2tl7MJC1TnRDoUZVJ-cXzHoiARa_m3Kfw2iFeVP1XMfEhUUlMNBb54_jmNA48vk3U58-ahXvSdWUwqKptMLSSBsg8cE_iahYT6RJTtX7xPw' },
  { name: 'Tacos', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPLgbJpqvyGpjyB1ObijNwvE4SlIXG2VszuLO5prLp46C19jJwU9Ky-8yLXmoiNhBC-ZoGGDmY9aELTjnzrBHj7WH5HmRjUiVx_ipHdz3gmh7qC2sWIm_DzEohYtLYPSUeI_MfQLuIZZG8ynHnwA4rQAiEDV8Dm-gkU-88NRLhGgk67r-IFgTk4z96h5wdQcYk6_3YBE1OX_Dl_yGbmLZkPiyFamM91sdgOept7mXKiRxmLj9B0jB145bKdGbm_96lvPUtMInjk-8' },
  { name: 'Pasta', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClQIPF5499Ze_Uenho3DGjmbvTtztctkR_E5jCQ6Sx2bBryuQL-uzHn7eEwhwrv-NcJCE5RX5NDmRIrwWMU5DX6aV-foEeALYrXXsw7wM_02P1nf2nox27cqVnuCowxz3JYIbKYHlV3xvEp5_ChX-yA1KHrKbJpbdGHi1HPTFKVfPqekMpKtgoCsDgam4IJ5OYYQFRO_IRpsAnv2cWFzKbYVj90GroD0hYns-yJHogvAQyYl6UvAejF4YYmx9v17nnJmknwL_WwLs' },
];

const FEATURED_RESTAURANTS = [
  { id: 1, name: 'The Pizza Lab', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNcbMQEgMB7QrOrgdjPvrj-25lZogOuS2AjLH3C4GaaSTnfilU18jB71woaD3mENoDAjqMmv3QdGZCVqAFSaJSyl68oON4VDJ_RhOsA-Jg4NrwCgnWdP8S3cpn5rmYu5y-v53h-hm5abdadPcPPAwhTnO_ejiJnVxu4zmtHUEOnKft_rnEIo6_s1c8PMna5tmlXRuBMmSgUHBkeyZoFr90lYuhZN2sS2j5uTN8PkhZV__45AoEsBLqDUDwShHfaFkHJypIo6dSx_Q', rating: 4.8, reviewCount: 200, priceLevel: '$$', cuisine: 'Italian • Pizza • Gourmet', deliveryTime: '20-30 min', deliveryFee: '$2.99 fee' },
  { id: 2, name: 'Burger Theory', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqa6keXYfgTsyNr1Yu9Dcb5chbzYXzRpbF2I8lHNPqAbWf5PswsHzjtX6C29bIVWCkOEqL2_krKv74oOhvnoiG3JGgw_NUX9ka7QnUVghxJ1QTVaM8Y8c9MbKz4Pt81Z9T3j-mbfc97ZX7S2DifY2fEafqqTsv6u9zYB5hPs6DVvwLQl1_Sxp7q9S6X9SdwJIxoeLLPrIl7kLX34wbbu64wHpCXqSRGPwApIDDMygp0fQOlcLpN_nfzBuYGqkUtbttE0RW7wyyhOE', rating: 4.7, reviewCount: 500, priceLevel: '$$', cuisine: 'American • Burgers • Grill', deliveryTime: '15-25 min', deliveryFee: 'Free' },
  { id: 3, name: 'Sashimi Spirit', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKb3YMbOBpnjEnGMVyH82jpsl1V4kDl6PkoE_Kl0Ne5aMHxBwTMCuHsP_x6FL6F0-lDVLXs0L7iHTgpXUJbfZGOLVS_sp8924t_dfIQ3h5LCvcaKd20Y0g6sajLA4u3PasLFs3TQj3QfuBz1VrTqCY-vSVBUQigT3KxH538kItYFMxIq1cHrgKm0qL1dCimhE2dmtzrCg_xUDM6WfWhfNxDx7801pZ0qdXfm1YlSH0jIrZigGuvQKTRy4zDTlk3zzINXaLP0mFuo4', rating: 4.9, reviewCount: 150, priceLevel: '$$$', cuisine: 'Japanese • Sushi • Healthy', deliveryTime: '30-45 min', deliveryFee: '$4.99 fee' },
  { id: 4, name: 'Taco Heaven', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdaedvirvgRlnghe-sJyiNpPDh1fS7NjFndyN1Jpcan8dLmSMTTORb_l7dPbxVNL_37qhuA1B9jSbKc9BBcjW0LeSrYrWAc9M0EJuvpuJz922CyQfVE12apB1i75zP7sBGRL-2ijI_5eTU95OGhlfUQmqwveynSTSHOxHX-0Bo_mzMIRrmAxgMWbsNvV972ZNsW5Cb5beIx-xOeyYB5xR39AO2IJhp8hgdh1WkRPhznUL5bLVk09C_WvRgRfmNDk0vCLV_x3boUBE', rating: 4.6, reviewCount: 300, priceLevel: '$', cuisine: 'Mexican • Street Food • Spicy', deliveryTime: '10-20 min', deliveryFee: '$1.99 fee' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [loading] = useState(false);
  const [error] = useState(null);

  const handleSearch = (query) => {
    console.log('Search:', query);
    navigate(`/restaurants?search=${query}`);
  };

  if (loading) return <LoadingSpinner message="Loading homepage..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div>
      <section className="hero-gradient relative py-24 md:py-32">
        <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 items-center gap-stack-xl">
          <div className="z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary font-label-md text-label-md mb-6">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span>Now delivering in 45 minutes</span>
            </div>
            <h1 className="font-display-lg text-display-lg lg:text-display-lg text-on-background mb-8 leading-[1.1]">
              Delicious <span className="text-primary italic">moments</span>, delivered.
            </h1>
            <SearchBar onSearch={handleSearch} />
            <div className="mt-8 flex items-center gap-6">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-Q10NZL70RJEH7nj1HE64C5DfEItVwAbO9u_U9Ye7VIrcfZa8FPUykPw7mebYJwxn6iNODZtH_cYlExGXg2xoZ7-_3bRMez6u7EwxVbnPRiubvn-gYp-Ok6PtKgp1IKMewz5UgnnmufkLvYEWsuUEBH0NoGv4f_xyvS_-wjK6W8J8udFqVdLeFeBRbnkodpbVl9aYBm4s7D_mCBef9q0yKsX8DAZ08Li44rAf0vOynjgP9Y0RxLqw2VieTmJq1mM1cXLxZcy90VM')" }} />
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCibJm00YynqYGGH9iFje4gcTSNaMwBY3CKADRugcfmq2R02ixXqvT0lazhW75dXbSfe19GLTKCRxOZ5OjmM9rc3LoIi3DsobYNRGaSbWPrJ2bYSFBWIFHAUM6c3ChvwN0xzNQezfysUcOEhcrKx7C4tmc6uC0HUgZVumNnOulqkmg4ngD_xnjZJNwYS2u9Fijknmym3p0531f0YztkCE6N-XFq7YWbfeAY1UBa_LrepIST0a42BKxVlhetepnBDFT_G6HXrZFBkz4')" }} />
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYyTcll1NgPGoCXCMFhNUaBGUQg83IoUjijmT1j4XFxIiIKeDaw89FEAy8TbKIvFZJ4p2B8fEJOBWlKlhMCNxcuQUqXhxp9Rzmit-l58vvghrnLhw7ZgihZtPYw-hDPVm-wrbWrWii007a8HlEUfnLwipN9_7u3mmlgozdQmLTCGeaFCYEn1NBE4SbU5DhdUnOqQ8FFZ_Hhl6Lo3gJ5gVzit-4DEaQKiTZq-NKe5ArHqif1-SehqEWPwOjkLtFkq9rMkCPx74wiL4')" }} />
              </div>
              <div className="text-on-surface-variant text-label-md font-label-md">
                <span className="text-primary font-bold">10k+</span> happy customers nearby
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl transform rotate-2">
              <img className="w-full h-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUtb-i8RBcGCnS7rDUBeWOWBe0HgXE6LSGd0ndqmwL5yG8VzKHPQ7boGUwz8nXFSXUgpBJeX0v-ei5PM7rOXBmv-kByWLA7co1F7vJqLyaRhbWAAk61Owd12rVm9u_TawFObmxmei4n5Tnl8UGjDM9zucFinW48ZKHqTzax2wNX5ekmDVASXbryGDPqSHJTqhsNwLkHJ3OXwJW9YfmyUvrkpM0eeYy4bsGxsaUCFV226HedzUOjl3oS4y8bJkPUWQiHDcZhZg8opc" alt="Hero" />
            </div>
            <div className="absolute -top-10 -left-10 z-20 glass-effect p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">timer</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant">Fast Delivery</p>
                <p className="text-[10px] text-primary">25-35 mins</p>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-6 z-20 glass-effect p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-tertiary/20 text-tertiary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant">Top Rated</p>
                <p className="text-[10px] text-tertiary">4.9 Average</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-stack-xl bg-surface-container-lowest">
        <div className="px-margin-desktop max-w-container-max mx-auto overflow-hidden">
          <div className="flex items-center justify-between mb-stack-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface">Explore Categories</h2>
            <div className="flex gap-2">
              <button className="p-2 border border-outline-variant rounded-full hover:bg-primary-container/5 transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="p-2 border border-outline-variant rounded-full hover:bg-primary-container/5 transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="flex gap-gutter overflow-x-auto hide-scrollbar pb-4 -mx-margin-desktop px-margin-desktop">
            {CATEGORIES.map(cat => (
              <CategoryCard key={cat.name} name={cat.name} imageUrl={cat.image} onClick={() => console.log('Category:', cat.name)} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-stack-xl px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 relative h-64 md:h-80 rounded-[2rem] overflow-hidden group">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDtq5vJZ0rh9TvVdaSHQLwjyAZnKSHlw4CRFSwjRkPG-9dKCg8znbYS-3JcEAwhsfVvh7UKro2uf773i-wyOz5Qo_Q-6Sjk3GTLwILM5G5-jgLzQix7wxbqVOIXQPIrWr0gUYml2MitwM_g2_aoEpLl_g86wNdkxYswaozZZJeJAuV-3M8C15ajcJUCP5mGjxU588GL0SIRJG3ZO10DV1JI5nzOhcmZhWiYgIa-QwKa8aSfnz8lul4Cw9MwL0WHSU8oYwQBNnVN54U')" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-12">
              <span className="text-white/80 font-label-md text-label-md mb-2 uppercase tracking-widest">Premium Selection</span>
              <h3 className="text-white font-headline-lg text-headline-lg mb-6 max-w-md">The best of fine dining, straight to your door.</h3>
              <button className="w-fit bg-white text-primary font-label-md text-label-md px-8 py-3 rounded-xl shadow-lg hover:bg-surface-container-low transition-colors">Explore Premium</button>
            </div>
          </div>
          <div className="relative h-64 md:h-80 rounded-[2rem] overflow-hidden bg-primary p-12 flex flex-col justify-end group">
            <div className="absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" />
            <div className="relative z-10">
              <div className="glass-effect w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-primary">
                <span className="material-symbols-outlined text-3xl">celebration</span>
              </div>
              <h3 className="text-white font-headline-md text-headline-md mb-2">First order?</h3>
              <p className="text-white/80 font-body-md text-body-md mb-4">Use code <span className="font-bold">FLOW50</span> for 50% off.</p>
              <span className="text-white font-label-md text-label-md underline underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer">Claim your gift</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-stack-xl px-margin-desktop max-w-container-max mx-auto">
        <div className="flex items-center justify-between mb-stack-lg">
          <h2 className="font-headline-md text-headline-md text-on-surface">Featured Restaurants</h2>
          <button className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline">
            View all <span className="material-symbols-outlined text-sm">arrow_outward</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
          {FEATURED_RESTAURANTS.map(r => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>

      <section className="py-stack-xl px-margin-desktop max-w-container-max mx-auto">
        <div className="bg-inverse-surface rounded-[3rem] p-12 lg:p-20 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-tertiary/10 rounded-full blur-[120px]" />
          <h2 className="relative z-10 text-white font-display-lg text-[40px] md:text-display-lg-mobile lg:text-display-lg mb-6 leading-tight">
            Ready to order <br className="hidden md:block" /> the extraordinary?
          </h2>
          <p className="relative z-10 text-white/70 font-body-lg text-body-lg mb-10 max-w-2xl">
            Join thousands of food lovers who trust Gourmet Flow for their daily indulgence. Download our app for an even faster experience.
          </p>
          <div className="relative z-10 flex flex-wrap justify-center gap-4">
            <button className="bg-white text-inverse-surface font-label-md text-label-md px-10 py-4 rounded-2xl flex items-center gap-3 hover:bg-surface-container-low transition-all">
              <span className="material-symbols-outlined">apps</span>
              <span>App Store</span>
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 font-label-md text-label-md px-10 py-4 rounded-2xl flex items-center gap-3 hover:bg-white/20 transition-all">
              <span className="material-symbols-outlined">play_arrow</span>
              <span>Google Play</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
