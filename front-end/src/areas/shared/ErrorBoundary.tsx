import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

const ErrorBoundary: FC = () => {
    const location = useLocation()

    return <div className="p-6 mx-auto w-[460px] text-center translate-y-2/4">
        <div className="flex flex-col gap-y-6">
            <h1 className="m-0 font-bold text-gray-500 text-9xl bg-clip-text bg-gradient-to-r from-main-lower to-main-upper">
                Oops!
            </h1>
            <p className="font-sans text-lg font-bold opacity-80">
                SOMETHING WENT WRONG!
            </p>
            <div className="flex gap-x-6 justify-center">
                    <Link to='/'
                        className="px-4 py-2 text-sm font-bold bg-green-600 text-white rounded-full bg-main"
                    >
                        QUAY LẠI TRANG CHỦ
                    </Link>
                    <Link
                        to={location.pathname}
                        className="px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-full bg-main"
                    >
                        RELOAD PAGE
                    </Link>
            </div>
        </div>
    </div>
};

export default ErrorBoundary;
