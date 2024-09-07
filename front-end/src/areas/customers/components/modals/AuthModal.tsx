import { FC } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { ModalAuthType } from "../../../../layouts/home/Header";
import ForgotPasswordModal from "./ForgotPasswordModal";

type AuthModalProps = {
    handleOk: () => void,
    modalType: ModalAuthType
}

const AuthModal: FC<AuthModalProps> = ({
    handleOk,
    modalType
}) => {
    return modalType === 'login' ? <LoginModal handleOk={handleOk} /> 
    : (modalType === 'register') ? <RegisterModal handleOk={handleOk} /> : <ForgotPasswordModal />

};

export default AuthModal;
