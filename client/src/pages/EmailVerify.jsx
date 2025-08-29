import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';



const EmailVerify = () => {
  axios.defaults.withCredentials = true; // Allow cookies to be sent with requests

  const navigate = useNavigate();

  const {backendUrl,isLoggedin,userData,getUserData} = useContext(AppContext)
  const inputRefs = React.useRef([])// Create a ref to store input elements

  const handleInput = (e, index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index + 1].focus(); // Move focus to the next input
    }
  }

  const handleKeyDown = (e,index) =>{
    if(e.key === 'Backspace' && e.target.value === '' && index > 0){
      inputRefs.current[index - 1].focus(); // Move focus to the previous input
    }
  }

  //paste feature
  const handlePaste = (e)=>{
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char; // Set the value of the input
        inputRefs.current[index].focus(); // Focus on the input
    }
  })
}

const onSubmitHandler = async(e) => {
  try {
    e.preventDefault(); // Prevent the default form submission behavior
    const otpArray = inputRefs.current.map(e => e.value)
    const otp = otpArray.join(''); // Join the values of the inputs to form the OTP
    const {data} = await axios.post(backendUrl + '/api/auth/verify-account', { otp });
    // Here you would typically send the OTP to your backend for verification
    // Example: axios.post('/api/verify-otp', { otp });

    if(data.success){
      toast.success('Email verified successfully');
      getUserData(); // Fetch updated user data
      navigate('/'); // Redirect to home page or any other page
    }
    else{
      toast.error(data.message); // Show error message if verification fails
    }
    
  } catch (error) {
    toast.error(error.message); // Show error message if request fails
  }

}

useEffect(()=>{
  isLoggedin && userData && userData.isAccountVerified && navigate('/'); // Redirect if already verified
  // This effect runs when the component mounts or when isLoggedin or userData changes
},[isLoggedin,userData])

  
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-blue-300'>

      <img onClick={()=>navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />

      <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>

        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill('').map((_, index) => (
            <input type="text" maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' ref={e => inputRefs.current[index] = e}
            onInput={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>
        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-800 text-white rounded-full cursor-pointer'>Verify Email</button>
      </form>
      
    </div>
  )
}
export default EmailVerify
