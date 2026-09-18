import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { LogOut, User2 } from 'lucide-react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../redux/authSlice.js'
import { USER_API_END_POINT } from '../utils/constant.js';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);

        }
    }
    return (
        <div className='bg-white shadow'>
            <div className='flex items-center justify-between mx-auto max-w-7xl px-4 py-3 flex-wrap'>
                <div>
                    <h1 className='text-2xl font-bold'>JOb<span className='text-[#f83002]'>Portal</span></h1>
                </div>
                <div className='flex items-center gap-4 mt-3 sm:mt-0 flex-wrap'>
                    <ul className='flex font-medium items-center gap-5 flex-wrap'>
                        {
                            user && user.role == 'recruiter' ? (
                                <>
                                    <li><Link to='/admin/companies'>Companies</Link></li>
                                    <li><Link to='/admin/jobs'>Jobs</Link></li>

                                </>

                            ) : (
                                <>
                                    <li><Link to='/'>Home</Link></li>
                                    <li><Link to='/jobs'>Jobs</Link></li>
                                    <li><Link to='/browse'>Browse</Link></li>
                                </>
                            )
                        }


                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2 flex-wrap'>
                                <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
                                <Button className="bg-[#8362be] hover:bg-[#724bb4]" onClick={() => navigate('/signup')}>Signup</Button>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar>
                                        <AvatarImage src={user?.profile?.profilePhoto || "https://tse4.mm.bing.net/th/id/OIP.SAcV4rjQCseubnk32USHigHaHx?pid=Api&P=0&h=180"} alt="@shadcn" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div>
                                        <div className='flex gap-5 items-center'>
                                            <div className='flex gap-2 space-y-2'>
                                                <Avatar className="cursor-pointer">
                                                    <AvatarImage src={user?.profile?.profilePhoto || "https://tse4.mm.bing.net/th/id/OIP.SAcV4rjQCseubnk32USHigHaHx?pid=Api&P=0&h=180"} alt="@shadcn" />
                                                </Avatar>
                                            </div>
                                            <div>
                                                <h3 className='font-medium'> {user?.fullName}</h3>
                                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col text-gray-600 mt-4'>
                                            {
                                                user && user.role == 'student' && (
                                                    <div className='flex items-center gap-4 mb-2'>
                                                        <User2 />
                                                        <Button variant="link"> <Link to='/profile'>view profile</Link></Button>
                                                    </div>
                                                )
                                            }

                                            <div className='flex items-center gap-4'>
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar
