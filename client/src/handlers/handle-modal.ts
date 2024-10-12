import authState from "../store/auth.state";
import {Dispatch, SetStateAction} from "react";
import {USERNAME} from "../entities/keys";

// не надо так выносить код, здесь получилась логика, которая нужна только в UserRegisterModal, компонент DrawingScreen не должен знать о модалке
export const handleModal = (setModalVisible: Dispatch<SetStateAction<boolean>>) => {
    // вот хороший пример, где можно написать свой хук для localStorage
    const username = localStorage.getItem(USERNAME);

    if (!username) {
        setModalVisible(true);
    } else {
        authState.setUsername(username);
    }
};