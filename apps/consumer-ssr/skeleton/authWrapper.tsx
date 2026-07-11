import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { RootState } from '../store'
import { useEffect } from 'react';
import { setLoginModalState } from '../features/auth/authSlice';
import { Spinner } from 'flowbite-react';

export const AuthWrapper = () => {

    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);
    console.log("auth:", auth);

    useEffect(() => {
        if (auth.sessionStarted && (!auth.token || !auth.email || !auth.fullName)) {
            console.log("ztoken--" + auth.token);
            dispatch(setLoginModalState({ showLoginPopup: true }))
        }
        if (auth.token) { console.log("mtoken:", auth.token); }
    }, [auth.sessionStarted])

    return (
        <>
            {!auth.sessionStarted && <div className='w-fill h-fill flex justify-center mt-4'>

                <Spinner className='m-auto' color='gray' />

            </div>}

            {(auth.sessionStarted && auth.token && auth.email.length > 0 && auth.fullName.length > 0) && <Outlet />}

        </>
    )
}