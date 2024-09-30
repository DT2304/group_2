import * as request from '~/utils/httpRequest';


export const search = async (q, type = 'less') => {
    try {
        const res = await request.get(`search`, {
            params: {
                q,
                type: type,
            },
        })

        return res
    } catch (error) {
        console.log(error)
    }

}

