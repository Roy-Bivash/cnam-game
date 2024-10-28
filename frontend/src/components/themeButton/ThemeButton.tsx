import { List, Moon, Sun, SunMoon } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "@/components/providers/theme-provider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ThemeButton() {
    const { setTheme, theme } = useTheme();
    const themeList = ["light", "dark", "system"];

    function setTheTheme() {
        const currentThemeIndex = themeList.indexOf(theme);
        const nextTheme = themeList[(currentThemeIndex + 1) % themeList.length];
        // @ts-ignore
        setTheme(nextTheme);
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" onClick={setTheTheme}>
                        {theme === "light" && (
                            <Sun className="h-[1rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                        )}
                        {theme === "dark" && (
                            <Moon className="h-[1rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                        )}
                        {theme === "system" && (
                            <SunMoon className="h-[1rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{theme}</p>
                </TooltipContent>
                </Tooltip>
        </TooltipProvider>
    );
}
