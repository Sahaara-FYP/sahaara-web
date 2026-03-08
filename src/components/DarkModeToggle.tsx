import { Switch } from "@/components/ui/switch";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { Sun, Moon } from "lucide-react";

interface DarkModeToggleProps {
  type?: "text" | "icon";
}

const DarkModeToggle = ({ type = "icon" }: DarkModeToggleProps) => {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <div className="flex gap-2 items-center">
      <div>
        <Switch
          id="dark-mode-toggle"
          onCheckedChange={() => {
            toggleTheme();
          }}
          checked={theme === "dark"}
          className="[&>span]:bg-app-primary-color"
        />
      </div>
      <div className="mb-1.5">
        <label htmlFor="dark-mode-toggle" className="text-sm">
          {type === "text" ? (
            theme == "light" ? (
              "Dark Mode"
            ) : (
              "Light Mode"
            )
          ) : theme == "light" ? (
            <Moon width={20} height={20} />
          ) : (
            <Sun width={20} height={20} />
          )}
        </label>
      </div>
    </div>
  );
};

export default DarkModeToggle;
