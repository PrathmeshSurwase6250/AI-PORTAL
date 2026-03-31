
import { BsRobot } from "react-icons/bs";
import { IoSparklesSharp } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth , provider } from '../utils/firebase';
import axios from 'axios';
import { ServerURL } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const Auth = () => {

  const dispatch = useDispatch() ;
  const handleGoogleAuth = async () => {
  try {
    const responces = await signInWithPopup(auth, provider);

    let User = responces.user;
    let username = User.displayName;
    let email = User.email;

    console.log(username, email);

    const result = await axios.post(
  ServerURL + '/api/auth/login',
  { username, email },
  { withCredentials: true }
);

localStorage.setItem("token", result.data.accessToken);

dispatch(setUserData(result.data.user));

  } catch (err) {
    console.log(err);
    dispatch(setUserData(null));
  }
};

  return (

    <div className='w-full min-h-screen bg-gray-100 flex items-center justify-center px-6 py-20'>
      <motion.div initial={{opacity : 0 , y:-40}} animate={{opacity : 1 , y:0}} transition={{duration : 1.05}} className='w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl border border-indigo-200'>
        <div className='flex items-center justify-center gap-3 mb-6'>
          <div className='bg-black text-white p-2 rounded-lg'><BsRobot size={18}/></div>
          <h2 className='font-semibold text-lg'>AI Portal</h2>
        </div>
        <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>Continue with
          <span className='bg-blue-200 text-blue-600 px-3 py-1 rounded-full inline-flex items-center'> <IoSparklesSharp size={16}/> AI Smart Job Assist</span>
        </h1>
        <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed md-8'>
        Sign in to access your personalized AI-powered job assistant, designed to help you find the perfect job opportunities and ace your interviews with confidence.
        </p>

        <motion.button whileHover={{scale : 1.05 , opacity : 0.9}} whileTap={{opacity: 1 , scale:0.98}} className='w-full bg-black text-white flex items-center justify-center gap-3 py-3 rounded-full shodow-md ' onClick={handleGoogleAuth}><FcGoogle size={20}/> Continue with Google</motion.button>
      </motion.div>
    </div>
  ) 
}

export default Auth