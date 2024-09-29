import { Api } from '../axios-config';

interface IAuth {
  token: string; 
  // role: string;
  id: string;

}

const auth = async (email: string, senha: string): Promise<IAuth | Error> => {
  try {
    const { data } = await Api.post('/login', { email, senha }); 

    if (data && data.token) { 
      localStorage.setItem('APP_ACCESS_TOKEN', data.token);
      
      return { token: data.token, id: data.id, };
    }

    return new Error('Erro no login.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro no login.');
  }
};

export const AuthService = {
  auth,
};
