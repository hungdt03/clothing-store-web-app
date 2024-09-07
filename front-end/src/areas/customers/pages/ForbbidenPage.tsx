import { Button, Result } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";

const ForbbidenPage: FC = () => {
    return <div className="h-screen flex items-center justify-center">
        <Result
            status="403"
            title="403"
            subTitle="XIN LỖI, BẠN KHÔNG CÓ QUYỀN TRUY CẬP VÀO TRANG NÀY"
            extra={<Link to="/"><Button type="primary">Quay lại trang chủ</Button></Link>}
        />
    </div>;
};

export default ForbbidenPage;
