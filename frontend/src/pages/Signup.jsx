import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Tags } from "lucide-react"


function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({email:"", password:"", role:"user", skills:""});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e)=>{
    // setForm({...form, [e.target.name]: e.target.value});

    //new edit cursor
    const {name, value} = e.target; // Modified: Destructure name and value from event target
    setForm({...form, [name]: value});
  }
  

  const handleSignup = async(e)=>{
    e.preventDefault();
    setLoading(true);

    //new edit cursor
    // Modified: Prepare data to send to the backend
    // If role is 'moderator', split skills string into an array, trim whitespace, and filter out empty strings.
    // Otherwise, send an empty array for skills.
    const dataToSend = {
      ...form,
      skills: form.role === "moderator" ? form.skills.split(",").map(skill => skill.trim()).filter(skill => skill !== "") : []
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(dataToSend)//edit------------------
      });

      const data = await res.json();
      
      if(res.ok){
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      }
      else{
        alert(data.message || "signup failed");
      }

    } 
    catch (error) {
      alert("Signup: internal server error");
      console.error(error);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex  bg-base-100 flex-col justify-start items-center p-6 sm:p-12">
      
      {/* extra ui */}
      <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Tags className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
      </div>
      {/* -------------------------------------------------------- */}

      <div className="card w-full max-w-sm shadow-xl bg-base-100    bg-cover bg-center bg-no-repeat bg-[url('/blob-scene-haikei.png')]">
        <form onSubmit={handleSignup} className="card-body">
          <h2 className="card-title justify-center">Sign Up</h2>

          {/*//previous input fields 
            <input
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

          {/*//old password section 
            <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered"
            value={form.password}
            onChange={handleChange}
            required
          /> */}
          <div className="form-control mt-4">
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

          {/* New: Role Selection Dropdown */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text font-medium">Role</span>
            </label>
            <select
              name="role"
              className="select select-bordered w-full"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>

          {/* New: Conditional Skills Input (only shows if role is 'moderator') */}
          {form.role === "moderator" && (
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-medium">Skills (comma-separated)</span>
              </label>
              <input
                type="text"
                name="skills"
                placeholder="e.g., HTML, CSS, JavaScript"
                className="input input-bordered w-full"
                value={form.skills}
                onChange={handleChange}
              />
            </div>
          )}



          <div className="form-control mt-4">
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
          
        </form>

        {/*Link component */}
          <div className="text-center pb-5">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Login Here
              </Link>
            </p>
          </div>


      </div>
     </div>
  );


}

export default Signup