interface AnalyticSimpleCardProps {
  title: string;
  icon: React.ReactNode;
  value: number;
  caption: string;
}

const AnalyticSimpleCard = ({
  title,
  icon,
  value,
  caption,
}: AnalyticSimpleCardProps) => {
  return (
    <div className="bg-app-foreground pl-5 pr-8 pt-5 pb-6 flex flex-col gap-2 w-fit rounded-2xl border min-h-full">
      <div className="flex items-start justify-between gap-25">
        <h3 className="font-semibold text-sm">{title}</h3>
        <div className="max-md:hidden w-6 h-6">{icon}</div>
      </div>
      <div>
        <p className="font-bold text-2xl">{value}</p>
      </div>
      <div>
        <p className="text-sm text-app-secondary-text">{caption}</p>
      </div>
    </div>
  );
};

export default AnalyticSimpleCard;
