import {makeAutoObservable} from "mobx";

// в socket.io уже есть фича разослать всем кроме себя (broadcast), для примера, поэтому эта фича с AuthState и запросом userName - лишняя
class AuthState {
    private _sessionId!: string;

    private _username!: string;

    public get getUsername() {
        return this._username;
    }

    public get getSessionId() {
        return this._sessionId;
    }

    constructor() {
        makeAutoObservable(this);
    }

    public setSessionId(id: string) {
        this._sessionId = id;
    }

    public setUsername(username: string) {
        this._username = username;
    }
}

const authState = new AuthState();

export default authState;