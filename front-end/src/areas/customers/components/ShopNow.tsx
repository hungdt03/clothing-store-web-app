import { FC } from "react";
import { Link } from "react-router-dom";

const ShopNow: FC = () => {
    return <div className="grid grid-cols-2" style={{
        height: '80vh'
    }}>
        <div>
            <iframe
                width="100%"
                height="100%"
                className="object-cover"
                title="My video"
                src="https://www.youtube.com/embed/fYMdlUjQNCQ?controls=0&autoplay=1&mute=1&modestbranding=1&showinfo=0&rel=0&disablekb=1"
            >
            </iframe>
        </div>
        <div className="p-12 flex flex-col gap-y-6 justify-center items-start bg-slate-100">
            <p className="font-semibold text-5xl">Your clothing store corner</p>
            <p className="text-[17px]">Select next day delivery & add a personal gift message at checkout. Our studio team will handwrite your note on our beautiful gift card for an extra special touch!</p>
            <Link to='/shop'>
                <button className="text-xl px-4 py-2 rounded-lg bg-orange-400 text-white">SHOP NOW</button>
            </Link>
        </div>
    </div>
};

export default ShopNow;
