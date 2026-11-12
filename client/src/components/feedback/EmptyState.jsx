// client/src/components/feedback/EmptyState.jsx
import { PackageOpen } from 'lucide-react';

const EmptyState = ({
  title = 'Chưa có dữ liệu',
  description = 'Không tìm thấy mục nào phù hợp với yêu cầu của bạn.',
  action = null,
}) => {
  return (
    <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center my-6">
      <div className="w-16 h-16 rounded-2xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 mb-4">
        <PackageOpen className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
