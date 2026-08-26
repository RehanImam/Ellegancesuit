import { Link } from "react-router-dom";

function HomePage() {
  return (
  
    <div className="min-h-screen bg-slate-900 text-white grid grid-cols-1 md:grid-cols-[1fr_2.5fr_1fr]">
      

      <div className="hidden md:block"></div>

     
      <div className="flex flex-col min-h-screen px-8 md:px-12 border-x border-white/10">
        
        
        <header className="pt-10 text-center ">
          <h2 className="text-xl font-bold bg-red-500 py-2.5 px-6 rounded-lg inline-block shadow-md ">
            Employee Management System
          </h2>
        </header>
        <div className="border-t border-white/10 my-10"></div>
        
        <main className="flex-1 flex flex-col justify-center items-center text-center py-10 max-w-xl mx-auto w-full">
          <p className="text-red-400 font-medium mb-6 pt-4 w-full">
            Don't waste time managing tasks between Admin and Employees
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Manage Your Team
          </h1>

          <p className="text-slate-300 text-base mb-10 leading-relaxed">
            Streamline workflows, track performance, and elevate productivity.
          </p>

          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link
              to="/login/employee"
              className="py-3.5 px-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition flex-1 text-center"
            >
              👨‍💻 Login as Employee
            </Link>

            <Link
              to="/login/admin"
              className="py-3.5 px-6 bg-black/30 hover:bg-black/50 border border-white/20 rounded-xl font-bold transition flex-1 text-center"
            >
              🛡️ Login as Admin
            </Link>
          </div>
        </main>

      
        <footer className="py-6 text-center text-xs text-slate-400 border-t border-white/10">
          Developed by <span className="text-white font-semibold">Mohd Saad</span>
        </footer>

      </div>

      
      <div className="hidden md:block"></div>
    </div>
  );
}

export default HomePage;