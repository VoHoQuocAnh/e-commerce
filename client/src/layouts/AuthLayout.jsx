// client/src/layouts/AuthLayout.jsx
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FlexCarousel from '../components/common/FlexCarousel';
import { ROUTES } from '../constants/routes';

const SHOWCASE_ITEMS = [
  {
    src: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&q=80&auto=format&fit=max',
    alt: 'CALEM Club Signature Boxy Tee',
    title: 'Signature Boxy Tee',
    subtitle: '260GSM Heavy Cotton',
  },
  {
    src: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&q=80&auto=format&fit=max',
    alt: 'Acid Washed Heavyweight Zip Hoodie',
    title: 'Acid Wash Zip Hoodie',
    subtitle: '420GSM Terry Fleece',
  },
  {
    src: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1200&q=80&auto=format&fit=max',
    alt: 'Parachute Baggy Cargo Pants',
    title: 'Parachute Baggy Cargo',
    subtitle: 'Nylon Ripstop',
  },
  {
    src: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=80&auto=format&fit=max',
    alt: 'CALEM Racing Varsity Bomber Jacket',
    title: 'Racing Varsity Bomber',
    subtitle: 'Chenille & PU Leather',
  },
  {
    src: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=80&auto=format&fit=max',
    alt: 'Studio Ribbed Cropped Baby Tee',
    title: 'Ribbed Cropped Baby Tee',
    subtitle: 'Women Archive',
  },
  {
    src: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&q=80&auto=format&fit=max',
    alt: 'Corduroy Relaxed Overshirt',
    title: 'Corduroy Overshirt',
    subtitle: 'Relaxed Fit',
  },
];

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 studio-grid-bg flex flex-col lg:flex-row">
      {/* Left 3D Liquid FlexCarousel Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900 p-10 flex-col justify-between border-r border-white/10">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-lime-400/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <Link to={ROUTES.HOME} className="relative z-10 flex items-center gap-3 w-fit">
          <div className="w-10 h-10 rounded-xl bg-lime-400 text-zinc-950 flex items-center justify-center font-black font-display text-xl">
            C
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-white">
            CALEM<span className="text-lime-400">.CLUB</span>
          </span>
        </Link>

        <div className="relative z-10 my-auto w-full" style={{ width: '100%', height: '560px' }}>
          <FlexCarousel
            items={SHOWCASE_ITEMS}
            preset="liquid"
            intro="rise"
            cardHeight={0.5}
            gap={12}
            radius={14}
            squeeze={0.2}
            focusOnClick
            autoplay
            interval={4}
            captions
          />
        </div>

        <p className="relative z-10 text-xs text-zinc-500 font-mono">
          CALEM.CLUB // SAIGON STREETWEAR ARCHIVE
        </p>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-lime-400 mb-8 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại cửa hàng 3D
          </Link>
          <div className="glass-panel rounded-3xl p-8 border border-white/15 shadow-2xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
