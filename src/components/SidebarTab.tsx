import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface SidebarTabPropTypes {
  link: string;
  icon: React.ElementType;
  label: string;
}

const SidebarTab = ({ link, icon: Icon, label }: SidebarTabPropTypes) => {
  return (
    <Button
      asChild
      variant="ghost"
      className="flex items-center gap-2 w-full justify-start"
    >
      <Link to={link}>
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </Link>
    </Button>
  );
};

export default SidebarTab;
