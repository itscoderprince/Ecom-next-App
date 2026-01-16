"use client";

import Link from 'next/link';
import { useSelector } from 'react-redux';
import {
    WEBSITE_HOME,
    WEBSITE_LOGIN,
    WEBSITE_REGISTER,
    USER_DASHBOARD
} from '@/routes/Website.route';
import { ADMIN_DASHBOARD } from '@/routes/AdminPanel.route';

const Navbar = () => {
    const { auth } = useSelector((state) => state.authStore);

    return (
        <nav className='flex justify-between items-center py-2 px-12 bg-red-200'>
            <div>
                <Link href={WEBSITE_HOME}>
                    <h1 className='text-2xl font-bold font-assistant'>logo</h1>
                </Link>
            </div>
            <div>
                <ul className='flex gap-8'>
                    <li><Link href={WEBSITE_HOME} className="hover:underline">Home</Link></li>

                    {!auth ? (
                        <>
                            <li><Link href={WEBSITE_LOGIN} className="hover:underline">Login</Link></li>
                            <li><Link href={WEBSITE_REGISTER} className="hover:underline">Register</Link></li>
                        </>
                    ) : (
                        <>
                            {auth.role === 'admin' && (
                                <li><Link href={ADMIN_DASHBOARD} className="hover:underline">Admin Dashboard</Link></li>
                            )}
                            <li><Link href={USER_DASHBOARD} className="hover:underline">My Account</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
