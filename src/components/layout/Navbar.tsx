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
                            <DropdownMenuTrigger style={{ outline: 'none' }}>
                                <Avatar>
                                    <AvatarImage
                                        src={(user as any).picture}
                                        alt={(user as any).username}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center'
                                        }}
                                    />
                                    <AvatarFallback
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {(user && user.username) ? user.username.substring(0, 1).toUpperCase() : "G"}
                                    </AvatarFallback>
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
                    <Button onClick={() => signIn()}>log in</Button>
                </NavigationMenuItem>
                }
            </NavigationMenuList>
        </NavigationMenu>
    </div>
  )
}

export default Navbar