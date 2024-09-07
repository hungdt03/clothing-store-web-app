import { Button, Divider, Input, message } from "antd";
import { FC, useState } from "react";
import accountService from "../../../../services/user-service";

const ForgotPasswordModal: FC = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const handleSubmit = async () => {
        setLoading(true)
        const response = await accountService.requestResetPassword(email);
        if (response.success) {
            message.success(response.message)
        } else message.error(response.message)

        setLoading(false)
    }
    return <div>
        <p className="mb-4 text-xl font-semibold text-center">QUÊN MẬT KHẨU</p>
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
                <span className="px-1">Địa chỉ email</span>
                <Input placeholder="Nhập địa chỉ email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="flex justify-end">
                <Button size="small" loading={loading} onClick={handleSubmit} type="primary">Gửi yêu cầu</Button>
            </div>
        </div>

        <Divider plain className="my-2">Lưu ý</Divider>
        <p>Chúng tôi sẽ gửi đường dẫn để reset mật khẩu tới hộp thư email của bạn</p>
    </div>;
};

export default ForgotPasswordModal;
