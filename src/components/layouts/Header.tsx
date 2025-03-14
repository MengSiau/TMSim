import { NavLink } from "react-router-dom";
import { appConfig } from "../../config/app";
import { ModeToggle } from "../mode-toggle";
import { CassetteTapeIcon, CoffeeIcon, SettingsIcon } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
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
          Built by{" "}
          <a
            href={appConfig.author.url}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            {appConfig.author.name}
          </a>
          . Source code is available on{" "}
          <a
            href={appConfig.github.url}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
        <div className="flex gap-2 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href=""
                  target="_blank"
                  className={buttonVariants({ variant: "ghost", size: "icon" })}
                >
                  <CoffeeIcon />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help support my work</p>
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