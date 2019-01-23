import api from '../requests/api'
import userData from '../requests/userData'

 const authentication = {
    login: async function (credentials) {
        try {
            if(this.isAuthenticated()) {
                return;
            }

            const response = await api().post('/auth/login', credentials, { useCredentails: true });

            const token = response.data.token;
            
            // eslint-disable-next-line
            console.log(token);

            const role = response.data.role;
            userData.setToken(token, userData.roles[role]);
        }
        catch (err) {
            userData.clear();
            throw err;
        }
    },
    register: async function (registrationData) {
        try {
            if(this.isAuthenticated()) {
                return;
            }

            const response = await api().post('/auth/register/patient', registrationData, { useCredentails: true });

            const token = response.data.token;
            const role = response.data.role;
            userData.setToken(token, role);
        }
        catch (err) {
            userData.clear();
            throw err;
        }
    },
    logout: async function () {
        userData.clear();
    },
    isAuthenticated: function () {
        return !!userData.getToken();
    }
}

export default authentication;