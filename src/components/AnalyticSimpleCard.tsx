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
    <div className="bg-app-foreground p-5 flex flex-col gap-2 rounded-2xl border w-full h-full">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-sm">{title}</h3>
        <div className="max-md:hidden w-5 h-5">{icon}</div>
      </div>

      <p className="font-bold text-2xl">
        {value}
        {unit}
      </p>

      <p className="text-sm text-app-secondary-text">{caption}</p>
    </div>
  );
};

export default AnalyticSimpleCard;
