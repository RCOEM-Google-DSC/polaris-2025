"use client"

import { Mail, MapPin } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link'

interface FooterProps {
  backgroundImage?: string;
  backgroundColor?: string;
}

const Footer = ({ 
  backgroundImage = '/svg/footerbg.svg',  // Default background image
  backgroundColor = ''      // Default background color
}: FooterProps) => {
  return (
    <footer className="relative text-white py-14"> {/* Increased padding */}
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 z-0 -opacity-50" 
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark overlay */}
        <div className={`absolute inset-0 ${backgroundColor}`}></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-8 relative z-10 flex-col"> {/* Increased padding */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"> {/* Increased gap and changed alignment */}
          {/* Left side with logo and branding */}
          <div className="space-y-3"> {/* Increased spacing */}
            <Image src="/svg/footerlogo.svg" alt="logo" width={400} height={50} />
          </div>

          {/* Vertical Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[6px] bg-white transform -translate-x-1/2 -mx-16"></div>

          {/* Right side with contact info and social links */}
          <div className="space-y-8 mx-8"> {/* Increased spacing */}
            {/* Contact Information */}
            <div className="space-y-4"> {/* Increased spacing */}
              <div className="flex items-start gap-3 text-base"> {/* Increased text size and gap */}
                <MapPin size={24} className="opacity-60 mt-1" /> {/* Increased icon size */}
                <span className="flex-1">
                  Shri Ramdeobaba College of Engineering and Management,<br />
                  Ramdeo Tekdi, Gittikhadan,Katol Road Nagpur- 440013
                </span>
              </div>
              <div className="flex items-center gap-3 text-base"> {/* Increased text size and gap */}
                <Mail size={24} className="opacity-60" /> {/* Increased icon size */}
                <Link href="mailto:dsc.rknec@gmail.com" className="hover:text-blue-400 transition-colors underline">
                  dsc.rknec@gmail.com
                </Link>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="space-y-4"> {/* Increased spacing */}
              <div className="text-base font-semibold">Follow Us:</div> {/* Increased text size */}
              <div className="flex gap-6"> {/* Increased gap */}
                {/* Instagram */}
                <Link href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </Link>
                {/* LinkedIn */}
                <Link href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </Link>
                {/* Twitter */}
                <Link href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer