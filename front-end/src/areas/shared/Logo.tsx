import { FC } from "react";

const Logo: FC = () => {
    return (
        <div className="p-3 flex justify-center items-center rounded-full font-bold bg-transparent text-3xl">
            <span className="text-black">&lt;Hung</span><span className="text-primary">Shop /&gt;</span>
        </div>
    );
};

export default Logo;
