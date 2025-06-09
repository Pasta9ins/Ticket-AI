import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Tags } from "lucide-react"

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({email:"", password:""});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e)=>{
    setForm({...form, [e.target.name]: e.target.value});
  }
  

  const handleLogin = async(e)=>{
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(form)
      });

      const data = await res.json();
      
      if(res.ok){
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      }
      else{
        alert(data.message || "login failed");
      }

    } 
    catch (error) {
      alert("Login: internal server error");
      console.error(error);
    }
    finally{
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-base-100   flex flex-col justify-start items-center p-6 sm:p-12">
      {/* extra ui */}
      <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Tags className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
      </div>
      {/* -------------------------------------------------------- */}
      <div className="card w-full max-w-sm shadow-xl bg-base-100      bg-cover bg-center bg-no-repeat bg-[url('/blob-scene-haikei.png')]">
        <form onSubmit={handleLogin} className="card-body">
          <h2 className="card-title justify-center">Login</h2>

          {/* <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered"
            value={form.email}
            onChange={handleChange}
            required
          /> */}
          <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40 z-10" />
                </div>
                <input
                  type="email"
                  name="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="your@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
          </div>


          {/* <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered"
            value={form.password}
            onChange={handleChange}
            required
          /> */}
          <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40 z-10" />
                  ) : (
                    <Eye className="size-5 text-base-content/40 z-10" />
                  )}
                </button>
              </div>
          </div>

          <div className="form-control mt-4">
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
        {/* link compo */}
        <div className="text-center pb-5">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>


      </div>
    </div>
  );
}

export default Login