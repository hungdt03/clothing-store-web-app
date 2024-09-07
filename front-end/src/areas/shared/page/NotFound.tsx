import { Button, Result } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";

const NotFound: FC = () => {
    return <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn truy cập có vẻ không tồn tại"
        extra={<Link to='/'><Button size="large" shape="round" type="primary">Quay lại trang chủ</Button></Link>}
    />
};

export default NotFound;
