import Link from 'next/link';
import {buttonVariants} from "@/Components/ui/button";
import {CalendarCheck2} from "lucide-react";

const Navbar = () => {
    return(
        <div className="bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
            <div className='container flex items-center justify-between'>
                <Link href='/'><CalendarCheck2 /></Link>
                <Link className={buttonVariants()} href='/sign-in'>
                    Sign In
                </Link>
            </div>
        </div>
    );
};

export default Navbar;