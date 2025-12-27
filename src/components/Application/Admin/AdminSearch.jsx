"use client";

import * as React from "react";
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Search,
} from "lucide-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import { useRouter } from "next/navigation";

const AdminSearch = () => {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
                onClick={() => setOpen(true)}
            >
                <span className="hidden lg:inline-flex">Search routes...</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        {adminAppSidebarMenu.map((item, index) => {
                            // Render main items if they have direct URLs
                            if (!item.submenu) {
                                return (
                                    <CommandItem key={index} onSelect={() => runCommand(() => router.push(item.url))}>
                                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                        <span>{item.title}</span>
                                    </CommandItem>
                                )
                            }
                            // Render subitems
                            return item.submenu.map((sub, subIndex) => (
                                <CommandItem key={`${index}-${subIndex}`} onSelect={() => runCommand(() => router.push(sub.url))}>
                                    <div className="mr-2 h-4 w-4 flex items-center justify-center">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary/20" />
                                    </div>
                                    <span>{sub.title}</span>
                                    <span className="ml-2 text-xs text-muted-foreground">({item.title})</span>
                                </CommandItem>
                            ))
                        })}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
};

export default AdminSearch;
