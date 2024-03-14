"use client";
import { RxDashboard } from "react-icons/rx";
import { FaUserFriends } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getSession, signIn, signOut } from 'next-auth/react';

function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState(undefined);
    const { setTheme } = useTheme();
    useEffect(() => {
        getSession().then((session) => {
            if (session) {
                setUser((session as any).user);
                console.log("user", (session as any).user);
            }
        });
    }, []);

  return (
    <div className="flex flex-row w-screen h-fit justify-between px-12 py-4 border-b-[1px] border-gray-200">
        <NavigationMenu>
            <NavigationMenuList className="gap-8">
                <NavigationMenuItem>
                    <NavigationMenuLink href="/" className="flex gap-2 items-center">
                        <RxDashboard className="h-7 w-7" />
                        Dashboard
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <Separator orientation="vertical" className="h-10"  />
                <NavigationMenuItem>
                    <NavigationMenuLink href="/friends" className="flex gap-2 items-center">
                        <FaUserFriends className="h-7 w-7" />
                        Friends
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem className="mr-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </NavigationMenuItem>
                {user !== undefined && 
                    user ?
                <>
                    <NavigationMenuItem>           
                        <DropdownMenu>
                            <DropdownMenuTrigger style={{ outline: 'none' }}>
                                <Avatar>
                                    <AvatarImage src={(user as any).picture} alt={(user as any).username} />
                                    <AvatarFallback>{(user as any) && ((user as any).username ? (user as any).username.substring(0, 1).toUpperCase() : "")}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => router.push('/settings')}>
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/login' })}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </NavigationMenuItem>
                </> :
                <NavigationMenuItem>
                    <Button className="gap-2" onClick={() => signIn()}>
                        Log In
                        <CiLogin className="h-5 w-5" />
                    </Button>
                </NavigationMenuItem>
                }
            </NavigationMenuList>
        </NavigationMenu>
    </div>
  )
}

export default Navbar