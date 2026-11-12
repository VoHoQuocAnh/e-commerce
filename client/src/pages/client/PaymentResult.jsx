// client/src/pages/client/PaymentResult.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import { paymentApi } from '../../services/paymentApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../constants/routes';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const verify = async () => {
      setLoading(true);
      try {
        const paramsObj = Object.fromEntries(searchParams.entries());
        const res = await paymentApi.verifyMomoRedirect(paramsObj);
        setResult(res.data);
      } catch (error) {
        setResult({
          isSuccess: false,
          orderCode: searchParams.get('orderId'),
          message: error.response?.data?.message || 'Không thể xác thực giao dịch thanh toán',
        });
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [searchParams]);

  if (loading) {
    return <Loader text="ĐANG XÁC THỰC CHỮ KÝ ĐIỆN TỬ HMAC SHA256 TỪ MOMO..." />;
  }

  const isSuccess = result?.isSuccess;

  return (
    <div className="max-w-xl mx-auto px-4 py-12 perspective-1000">
      <div className="glass-panel rounded-3xl p-8 border border-white/15 text-center relative overflow-hidden">
        <div
          className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
            isSuccess
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
              : 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
          }`}
        >
          {isSuccess ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
          KẾT QUẢ GIAO DỊCH MOMO SANDBOX (HMAC SHA256)
        </span>

        <h1 className="font-display text-2xl sm:text-3xl font-black text-white mb-2">
          {isSuccess ? 'THANH TOÁN THÀNH CÔNG!' : 'THANH TOÁN CHƯA HOÀN TẤT'}
        </h1>
        <p className="text-sm text-zinc-400 mb-6">{result?.message}</p>

        <div className="bg-zinc-900/80 rounded-2xl p-5 border border-zinc-800 text-left space-y-3 mb-8 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">Mã đơn hàng:</span>
            <span className="font-mono font-bold text-white">{result?.orderCode || 'N/A'}</span>
          </div>
          {result?.transId && (
            <div className="flex justify-between">
              <span className="text-zinc-400">Mã giao dịch MoMo:</span>
              <span className="font-mono text-lime-400">{result.transId}</span>
            </div>
          )}
          {result?.amount > 0 && (
            <div className="flex justify-between">
              <span className="text-zinc-400">Số tiền giao dịch:</span>
              <span className="font-bold text-white">{formatCurrency(result.amount)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to={ROUTES.ORDERS} className="flex-1">
            <Button variant="primary" className="w-full">
              <Package className="w-4 h-4" /> XEM LỊCH SỬ ĐƠN HÀNG
            </Button>
          </Link>
          <Link to={ROUTES.PRODUCTS} className="flex-1">
            <Button variant="secondary" className="w-full">
              TIẾP TỤC MUA SẮM <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
