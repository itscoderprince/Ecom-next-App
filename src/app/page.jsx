import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <nav className='flex justify-between items-center py-2 px-12 bg-red-200'>
      <div>
        <h1 className='text-2xl font-bold'>logo</h1>
      </div>
      <div>
        <ul className='flex gap-8'>
          <li><Link href='/'>Home</Link></li>
          <li><Link href='/auth/login'>Login</Link></li>
          <li><Link href='/auth/register'>Register</Link></li>
          <li><Link href='/admin/dashboard'>Admin Dashboard</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default page