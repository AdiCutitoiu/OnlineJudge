const ID_TOKEN = "iCareToken"
const ID_ROLE = "iCareRole"

export default {
    getToken() {
        return localStorage.getItem(ID_TOKEN);
    },
    setToken(token, role) {
        if(role !== this.roles.Admin && role !== this.roles.Doctor && role !== this.roles.Patient) {
            role = this.roles.Patient;
        }

        localStorage.setItem(ID_TOKEN, token);
        localStorage.setItem(ID_ROLE, role);
        return true;
    },
    clear() {
        localStorage.removeItem(ID_TOKEN);
        localStorage.removeItem(ID_ROLE);
    },
    isAdmin() {
        return localStorage.getItem(ID_ROLE) === this.roles.Admin;
    },
    isDoctor() {
        return localStorage.getItem(ID_ROLE) === this.roles.Doctor;
    },
    isPatient() {
        return localStorage.getItem(ID_ROLE) === this.roles.Patient;
    },
    roles: {
        Admin: 1,
        Doctor: 2,
        Patient: 3
    }
};
