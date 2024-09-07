import { FC } from "react";

const Footer: FC = () => {
    return <div className="mt-16 bg-slate-100 text-black px-10 py-4 flex justify-between">
        <p>@2003 Made by Hungdto</p>
        <div className="flex gap-x-4">
            <p>Terms of Services</p>
            <p>Privacy & Policy</p>
        </div>
    </div>
};

export default Footer;
