import { FC, ReactNode } from "react";

type CardBorderProps = {
    children: ReactNode;
    padding?: string | number,
    className?: string;
}

const CardBorder: FC<CardBorderProps> = ({
    children,
    padding = 6,
    className
}) => {
    return <div className={`bg-white ${className} shadow-sm rounded-lg p-${padding}`}>{children}</div>
};

export default CardBorder;
