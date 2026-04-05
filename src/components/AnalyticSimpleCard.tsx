interface AnalyticSimpleCardProps {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  caption: string;
  unit?: string;
}

const AnalyticSimpleCard = ({
  title,
  icon,
  value,
  caption,
  unit,
}: AnalyticSimpleCardProps) => {
  return (
    <div className="bg-white/5 p-6 flex flex-col gap-4 rounded-2xl border border-white/10 shadow-lg shadow-black/20 w-full h-full relative overflow-hidden group hover:border-white/20 transition-colors">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full pointer-events-none blur-2xl group-hover:bg-indigo-500/10 transition-colors" />

      <div className="flex items-start justify-between relative z-10">
        <h3 className="font-semibold text-white/70 text-[13px] tracking-wide uppercase">
          {title}
        </h3>
        <div className="max-md:hidden w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          {icon}
        </div>
      </div>

      <div className="relative z-10">
        <p className="font-bold text-3xl text-white tracking-tight">
          {value}
          <span className="text-xl ml-1 text-white/50">{unit}</span>
        </p>
      </div>

      <p className="text-[13px] text-white/40 font-medium relative z-10 mt-auto">
        {caption}
      </p>
    </div>
  );
};

export default AnalyticSimpleCard;
