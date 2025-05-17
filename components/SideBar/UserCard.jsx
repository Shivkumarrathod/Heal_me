'use client';

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/utils/firebase.config';
import { useRouter } from 'next/navigation';

const UserCard = ({ isLight }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    if (!user) {
      router.push('/otplogin');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-between p-3 rounded-lg mt-4 cursor-pointer ${
        isLight ? 'bg-[#D1E9FF]' : 'bg-[#2A2A2A]'
      }`}
    >
      <div className="flex items-center gap-3">
        <img
          src={user?.photoURL || "https://i.pravatar.cc/40"}
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className={`text-sm font-medium ${isLight ? 'text-[#222260]' : ''}`}>
            {user?.phoneNumber || "Guest User"}
          </div>
          <div className="text-xs text-[#64BD64]">
            {user ? 'Free Plan' : 'Click to Login'}
          </div>
        </div>
      </div>
      <button
        className="bg-[#64BD64] text-sm text-black px-3 py-1 rounded hover:bg-[#52a552] transition"
        onClick={(e) => {
          e.stopPropagation(); // prevent triggering parent click
          if (!user) {
            router.push('/otplogin');
          } else {
            // Handle upgrade logic
            alert("Upgrade Coming Soon!");
          }
        }}
      >
        {user ? 'Upgrade' : 'Login'}
      </button>
    </div>
  );
};

export default UserCard;
