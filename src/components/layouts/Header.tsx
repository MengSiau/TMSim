import { NavLink } from "react-router-dom";
import { appConfig } from "../../config/app";
import { ModeToggle } from "../mode-toggle";
import { CassetteTapeIcon, SettingsIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

export function Header() {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur">
      <div className="container px-4 md:px-8 flex justify-between h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <NavLink to="/" className="mr-6 flex items-center space-x-2">
            <CassetteTapeIcon />
            <span className="font-bold">{appConfig.name}</span>
          </NavLink>
        </div>
        <a href="/" className="mr-6 flex items-center space-x-2 md:hidden">
          <span className="font-bold inline-block">{appConfig.name}</span>
        </a>
        <p className="text-center text-sm text-pretty leading-loose text-muted-foreground md:text-left">
          Turing Machine Simulator
        </p>
        <div className="flex gap-2 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
   
   
              </TooltipTrigger>
              <TooltipContent>
                <p>Placeholder</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="ghost" size="icon">
            <SettingsIcon />
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}