"use client";

import { useSelector } from 'react-redux';
import Navbar from '@/components/Application/Navbar';

const MyAccount = () => {
  const { auth } = useSelector((state) => state.authStore);
  console.log(auth);


  return (
    <div>
      <Navbar />

      <div className="p-12">
        <h2 className="text-2xl font-bold mb-4 font-assistant">My Account</h2>
        <div className="bg-white dark:bg-card p-6 rounded shadow-sm border">
          <p className="text-lg">Welcome back, <span className="font-semibold">{auth?.name || 'User'}</span>!</p>
          <p className="text-muted-foreground mt-2">Email: {auth?.email}</p>
          <p className="text-muted-foreground">Role: <span className="capitalize">{auth?.role}</span></p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded hover:bg-muted cursor-pointer transition-colors">
              <h3 className="font-bold">My Orders</h3>
              <p className="text-sm text-muted-foreground">Check your order history and status.</p>
            </div>
            <div className="p-4 border rounded hover:bg-muted cursor-pointer transition-colors">
              <h3 className="font-bold">Wishlist</h3>
              <p className="text-sm text-muted-foreground">View items you've saved for later.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;