import { Express, Request, Response } from 'express';
import { RegisterUserUsecase } from '../usecases/registerUser';
import { LoginUserUsecase } from '../usecases/loginUser';

interface SetAuthEndpointsArgs {
  server: Express;
  registerUserUsecase: RegisterUserUsecase;
  loginUserUsecase: LoginUserUsecase;
}

export function setAuthEndpoints(args: SetAuthEndpointsArgs) {
  const { server, registerUserUsecase, loginUserUsecase } = args;

  server.post('/register', async (req: Request, res: Response) => {
    if (req.body === undefined) {
      res.status(400).send();
      return;
    }
    const { username, password, name } = req.body;

    if (
      username === undefined ||
      password === undefined ||
      name === undefined
    ) {
      res.status(400).json({
        error:
          'Missing one or more required body params: username, password, name',
      });
    }

    const registerUserResult = await registerUserUsecase(
      username,
      password,
      name
    );

    if (registerUserResult.code === 'ERROR_EXISTS') {
      res.status(400).json({ error: registerUserResult.message });
      return;
    }

    if (registerUserResult.code === 'ERROR') {
      res.status(500).send();
      return;
    }

    res.status(200).send();
  });

  server.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === undefined || password === undefined) {
      res.status(400).json({
        error: 'Missing one or more required body params: username, password',
      });
    }

    const loginResult = await loginUserUsecase(username, password);

    if (loginResult.code === 'ERROR') {
      res.status(401).json({ error: 'Incorrect user or password' });
      return;
    }
    res.status(200).send({ token: loginResult.token });
  });
}
