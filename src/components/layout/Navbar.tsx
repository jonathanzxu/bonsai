"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    useEffect(() => {
        getSession().then((user) => {
            console.log("User: ", user)
            setUser((user as any).user);
        });
    }, []);

  return (
    <div className="flex flex-row w-screen h-fit justify-between px-12 py-4">
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/">dashboard</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
            <NavigationMenuList>
                {user !== undefined && 
                    user ?
                <>
                    <NavigationMenuItem>           
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage src={(user as any).profile} alt={(user as any).username} />
                                    <AvatarFallback>{(user as any).username.substring(0, 1).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => router.push('/settings')}>
                                    manage profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/login' })}>
                                    log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </NavigationMenuItem>
                </> :
                <NavigationMenuItem>
                    <Button onClick={() => signIn()}>log in</Button>
                </NavigationMenuItem>
                }
            </NavigationMenuList>
        </NavigationMenu>
    </div>
  )
}

export default Navbar