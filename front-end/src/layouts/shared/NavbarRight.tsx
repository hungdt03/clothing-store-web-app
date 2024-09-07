import { faHeart, faSearch, faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Modal, Popover } from "antd";
import { FC, useState } from "react";
import AccountDialog from "./AccountDialog";
import useModal from "../../hooks/useModal";
import { ModalAuthType } from "../home/Header";
import { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { selectCart } from "../../feature/cart/cartSlice";
import { Link } from "react-router-dom";
import AuthModal from "../../areas/customers/components/modals/AuthModal";
import { signOut } from "../../feature/auth/authSlice";
import SearchDialog from "./SearchDialog";

const NavbarRight: FC = () => {
    const { handleCancel, handleOk, isModalOpen, showModal } = useModal();
    const [modalAuthType, setModalAuthType] = useState<ModalAuthType>('login')
    const dispatch = useDispatch<AppDispatch>();
    const { cartItems } = useSelector(selectCart)

    const handleLogout = () => {
        dispatch(signOut())
        handleOk()
    }

    const handleOpenPopup = (typeModal: ModalAuthType) => {
        setModalAuthType(typeModal)
        showModal()
    }

    return <>
        <div className="flex gap-x-5 text-black text-lg">
           
            <Popover
                trigger='click'
                placement="bottomRight"
                content={<SearchDialog />}
            >
                 <FontAwesomeIcon className="cursor-pointer" icon={faSearch} />
            </Popover>
            <Popover
                trigger='click'
                placement="bottomRight"
                content={<AccountDialog
                    onLoginPopupOpen={() => handleOpenPopup('login')}
                    onRegisterPopupOpen={() => handleOpenPopup('register')}
                    onLogout={handleLogout}
                />}
            >
                <FontAwesomeIcon className="cursor-pointer" icon={faUser} />
            </Popover>
            <FontAwesomeIcon className="cursor-pointer" icon={faHeart} />
            <Badge size="small" showZero count={cartItems.length}>
                <Link to="/cart">
                    <FontAwesomeIcon icon={faShoppingCart} />
                </Link>
            </Badge>
        </div>

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            centered
            width={modalAuthType === 'register' ? 700 : 500}
            footer={[]}
        >
            <AuthModal modalType={modalAuthType} handleOk={handleOk} />
        </Modal>
    </>
};

export default NavbarRight;
