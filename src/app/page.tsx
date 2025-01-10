"use client"
import { logout } from '@/actions/logout';
import { getLoggedInUser } from '@/appwrite/config';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Models } from 'node-appwrite';
import React, { useEffect, useState } from 'react';

const HomePage: React.FC = () => {
  const [user,setUser] = useState<Models.User<Models.Preferences> | null>()
  useEffect(()=>{
    getLoggedInUser().then(user=>setUser(user))
  },[])
  return (
    <div>
      <h1>Welcome to Polaris 2025</h1>
      <p>testing..</p>
      {user ? <Button onClick={async ()=> await logout()}>
        Log out
      </Button> : <Link className='underline' href={'/login'}>Login</Link>}
    </div>
  );
};

export default HomePage;