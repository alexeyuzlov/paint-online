import { Button, Modal } from 'react-bootstrap';
import { ChangeEvent, useState } from 'react';
import authState from '../store/auth.state';
import { USERNAME } from '../entities/keys';

const UserRegisterModal = () => {
    const [modal, setModal] = useState(true);
    const [username, setUsername] = useState('');

    const connectionHandler = () => {
        authState.setUsername(username);
        localStorage.setItem(USERNAME, username);
        setModal(false);
    };

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    return (
        <Modal show={modal}>
            <Modal.Header>
                <Modal.Title>Введите ваше имя</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => connectionHandler()}
                >
                    Войти
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserRegisterModal;