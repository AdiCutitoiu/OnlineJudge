const ID_TOKEN = "iCareToken"
const ID_ROLE = "iCareRole"

export default {
    getToken() {
        return localStorage.getItem(ID_TOKEN);
    },
    setToken(token, role) {
        if(role !== this.roles.Admin && role !== this.roles.Moderator && role !== this.roles.Normal) {
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
        return localStorage.getItem(ID_ROLE) == this.roles.Admin;
    },
    isModerator() {
        return localStorage.getItem(ID_ROLE) == this.roles.Moderator;
    },
    isNormal() {
        return localStorage.getItem(ID_ROLE) == this.roles.Normal;
    },
    roles: {
        Admin: 1,
        Moderator: 2,
        Normal: 3
    }
};
