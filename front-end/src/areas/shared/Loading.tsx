import { Spin } from "antd";
import { FC } from "react";

const Loading: FC = () => {
    return <div style={{
        zIndex: 10000
    }} className="bg-opacity-30 bg-black fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
         <Spin size="large" />
    </div>;
};

export default Loading;
