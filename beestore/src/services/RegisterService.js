import * as request from '~/utils/httpRequest';

export const PostRegister = async (username, email, password) => {
    try {
      const response = await request.post('/register', {
        username,
        email,
        password
      });
    
      return response;
    } catch (error) {
      throw error;
    }
  };