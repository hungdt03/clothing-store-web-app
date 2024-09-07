import { Modal } from "antd";
import { FC, ReactNode } from "react";
import LoginModal from "./modals/LoginModal";
import useModal from "../../../hooks/useModal";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../feature/auth/authSlice";
import { useNavigate } from "react-router-dom";

type RequiredAuthenticationProps = {
    children: ReactNode;
    urlRedirectAfterAuthenticated?: string;
    handleIfAuthenticated: () => void
}

const RequiredAuthentication: FC<RequiredAuthenticationProps> = ({
    children,
    urlRedirectAfterAuthenticated,
    handleIfAuthenticated
}) => {
    const { handleCancel, handleOk, isModalOpen, showModal } = useModal();
    const { user } = useSelector(selectAuth)
    const navigate = useNavigate()

    const handleButtonClick = () => {
        if (user) {
            handleIfAuthenticated && handleIfAuthenticated();
        } else {
            showModal();
        }
    };

    const handleAuthenticationSuccess = () => {
        handleOk()
        navigate(urlRedirectAfterAuthenticated!)
    }

    return (
        <>
            <div className="w-full" onClick={handleButtonClick}>
                {children}
            </div>
            <Modal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
                footer={[]}
            >
                <LoginModal handleOk={handleAuthenticationSuccess} />
            </Modal>
        </>
    );
};

export default RequiredAuthentication;
