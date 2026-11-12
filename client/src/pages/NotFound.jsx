// client/src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import { ROUTES } from '../constants/routes';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-zinc-950 studio-grid-bg flex items-center justify-center p-6">
      <div className="glass-panel rounded-3xl p-10 max-w-md w-full text-center border border-white/15 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-lime-400/15 border border-lime-400/40 flex items-center justify-center text-lime-400 mx-auto">
          <Compass className="w-8 h-8 animate-spin" />
        </div>
        <h1 className="text-6xl font-black font-display text-white">404</h1>
        <p className="text-sm text-zinc-400">
          Không gian 3D bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang bộ sưu tập khác.
        </p>
        <Link to={ROUTES.HOME} className="inline-block">
          <Button size="lg">
            <ArrowLeft className="w-4 h-4" /> Quay về trang chủ Studio
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
