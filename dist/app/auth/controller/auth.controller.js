import authService from "../service/auth.service";
class AuthController {
    authService = authService;
    constructor() {
    }
    register = async (req, res, next) => {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json({ message: 'User created successfully', success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    };
}
export default new AuthController();
