import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
import useMobile from '../hooks/useMobile';


const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSearchPage,setIsSearchPage] = useState(false)
    const [ isMobile ] = useMobile()
    const params = useLocation()
    const searchText = params.search.slice(3)
    const [isListening, setIsListening] = useState(false)

    const handleVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice search is not supported in this browser. Try Chrome or Edge!");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const speechToText = event.results[0][0].transcript;
            const url = `/search?q=${encodeURIComponent(speechToText)}`;
            navigate(url);
        };

        recognition.start();
    };

    useEffect(()=>{
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
    },[location])


    const redirectToSearchPage = ()=>{
        navigate("/search")
    }

    const handleOnChange = (e)=>{
        const value = e.target.value
        const url = `/search?q=${value}`
        navigate(url)
    }

  return (
    <div className='w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-xl border-2 border-gray-200 overflow-hidden flex items-center text-gray-500 bg-white shadow-sm group focus-within:border-gray-400 focus-within:shadow-md transition-all duration-300 hover:shadow-md'>
        <div>
            {
                (isMobile && isSearchPage ) ? (
                    <Link to={"/"} className='flex justify-center items-center h-full p-2 m-1 group-focus-within:text-gray-700 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors'>
                        <FaArrowLeft size={20}/>
                    </Link>
                ) :(
                    <button className='flex justify-center items-center h-full p-3 group-focus-within:text-gray-700 transition-colors'>
                        <IoSearch size={22}/>
                    </button>
                )
            }
        </div>
        <div className='w-full h-full'>
            {
                !isSearchPage ? (
                     //not in search page
                     <button
                        type="button"
                        onClick={redirectToSearchPage}
                        className='w-full h-full flex items-center bg-transparent border-none outline-none cursor-pointer'
                        tabIndex={0}
                        aria-label="Go to search page"
                     >
                        <TypeAnimation
                                sequence={[
                                    // Same substring at the start will only be typed out once, initially
                                    'Search "milk"',
                                    1000, // wait 1s before replacing "Mice" with "Hamsters"
                                    'Search "bread"',
                                    1000,
                                    'Search "sugar"',
                                    1000,
                                    'Search "panner"',
                                    1000,
                                    'Search "chocolate"',
                                    1000,
                                    'Search "curd"',
                                    1000,
                                    'Search "rice"',
                                    1000,
                                    'Search "egg"',
                                    1000,
                                    'Search "chips"',
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                            />
                     </button>
                ) : (
                    //when i was search page
                    <div className='w-full h-full'>
                        <input
                            type='text'
                            placeholder='Search for atta dal and more.'
                            autoFocus
                            defaultValue={searchText}
                            className='bg-transparent w-full h-full outline-none'
                            onChange={handleOnChange}
                        />
                    </div>
                )
            }
        </div>
        
        {/* Voice Search Button */}
        <div className='flex items-center justify-center h-full pr-3'>
            <button 
                type="button" 
                onClick={handleVoiceSearch}
                className={`p-2 rounded-full transition-all duration-300 relative ${
                    isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'text-gray-400 hover:text-green-600 hover:bg-slate-50'
                }`}
                title="Search by voice"
            >
                {isListening ? (
                    <>
                        <BiMicrophoneOff size={18} />
                        <span className="absolute -inset-1 rounded-full border-2 border-red-500 animate-ping opacity-75"></span>
                    </>
                ) : (
                    <BiMicrophone size={18} />
                )}
            </button>
        </div>
    </div>
  )
}

export default Search