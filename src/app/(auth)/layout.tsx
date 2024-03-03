import { FC, ReactNode} from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ( {children} ) => {
    return (
        <div className='flex'>
            <div className='bg-slate-800 p-2 rounded-l-md'>
                {/*Line on left for design*/}
            </div>
            <div className='bg-slate-200 p-10 rounded-r-md'>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;