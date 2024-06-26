import { LoginDto, SignUpDto } from "src/auth/dto";


export const validAuthCreds: SignUpDto = {
    email: "test@gmail.com",
    password: 'Os49AGV8p&aMx-5(0'
};

export const invalidPasswordCreds: SignUpDto = {
    email: "test2@gmail.com",
    password: '123'
}

export const invalidEmailCreds: SignUpDto = {
    email: "test2",
    password: '0G8|dJ~CBgNNyES+k5QxXtS'
}

export const wrongPasswordCreds: LoginDto = {
    email: "test@gmail.com",
    password: 'Os49A&aMx-5(0'
}

export const nonExistentAccountCreds: LoginDto = {
    email: 'test3@gmail.com',
    password: '0G8|dJ~CBgNNyES+k5QxXtS'
}

//////////////////////////////////////
// TEST USERS CREDS //////////////////
//////////////////////////////////////

export const testUser2Creds: SignUpDto = {
    email: "test2@gmail.com",
    password: 'j5h&1H5Z/c4EhYAK]Xfq4R"$]F'
}

///////////////////////////////////////
// TOKENS /////////////////////////////
///////////////////////////////////////

export const getUserToken = (userNum: number) => {
    return `$S{user1${userNum}Token}`;
}


