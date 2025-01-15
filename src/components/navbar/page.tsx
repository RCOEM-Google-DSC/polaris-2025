const Navbar = () => {
    return (
      <nav className="w-full bg-black/95 border-b border-white/10 px-4 ">
        <div className="flex items-center gap-2">
          <img 
            src="/svg/gdg.svg"
            alt="Google Developer Groups"
            className="h-12"
          />
          <img 
            src="/svg/gdgname.svg"
            alt="Google Developer Groups"
            className="h-16 mt-5"
          />
        </div>
      </nav>
    )
  }
  
  export default Navbar
  