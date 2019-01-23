import api from '../requests/api'

 const patients = {
    getAllPatients: async function () {
        try {

            return await api().get('/user/admin/patients',{useCredentials: true});
        }
        catch (err) {
            throw err;
        }
    }
}

export default patients;