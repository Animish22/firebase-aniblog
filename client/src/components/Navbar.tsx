import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/context";
import { SignOut } from "@/firebase/auth/signOut";
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps { }

const Navbar: React.FC<NavbarProps> = ({ }) => {

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    let success = false ; 
    try {
      await SignOut();
      success = true ;
      setUser(null);
      navigate('/');
    } catch (error) {
      console.log(error) 
    }finally{
      console.log(`Success: ${success}`)  
    }
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight">
          AniBlog
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 ">
          <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition">
            Home
          </Link>
          <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition">
            Blog
          </Link>
          {!user && <Link to="/signup">
            <Button variant="outline" className="w-full">
              Sign Up
            </Button>
          </Link>}
          {!user && <Link to="/signin">
            <Button variant="outline" className="w-full">
              Sign In
            </Button>
          </Link>}
          {user && <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>}
          {user && (user?.photoURL ? <Link to="/profile"> <img src={`${user.photoURL}`} height={'30px'} width={'30px'} className="rounded-2xl" alt="Profile Page" />  </Link> : <Link to="/profile">
            <Button variant="outline" className="w-full">
              Profile Page
            </Button>
          </Link>)}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-sm">
              <SheetHeader className="text-left">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="grid gap-4 mt-4">
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition">
                  Home
                </Link>
                <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition">
                  Blog
                </Link>
                {!user && <Link to="/signup">
                  <Button variant="outline" className="w-full">
                    Sign Up
                  </Button>
                </Link>}
                {!user && <Link to="/signin">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>}
                {user && <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  Sign Out
                </Button>}
                {user && (user?.photoURL ? <img src={`${user.photoURL}`} height={'30px'} width={'30px'} className="rounded-2xl" alt="Profile Page" /> : <Link to="/profile">
                  <Button variant="outline" className="w-full">
                    Profile Page
                  </Button>
                </Link>)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;